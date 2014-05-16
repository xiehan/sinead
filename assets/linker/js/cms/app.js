(function () {
'use strict';


angular
  .module('cms-templates', [])
;

angular
  .module('sineadCMS', [
    'ngSanitize',
    'ui.router',
    'mm.foundation',
    'cms-templates',
    'sineadCMS.models',
    'sineadCMS.modal.storyEditor',
    'sineadCMS.modal.profileEditor'
  ])

  .constant('ITEMS_PER_PAGE', 10)

  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'ITEMS_PER_PAGE', function ($locationProvider, $stateProvider, $urlRouterProvider, ITEMS_PER_PAGE) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $stateProvider
      .state('cms', {
        abstract: true,
        url: '/cms',
        resolve: {
          user: ['User', function (User) {
            return User.identify().$promise;
          }],
          csrfToken: ['CsrfToken', 'TokenService', function (CsrfToken, TokenService) {
            return CsrfToken.get().$promise.then(function (token) {
              TokenService.set(token._csrf);
              return null;
            });
          }]
        },
        views: {
          '': {
            templateUrl: 'cms/index.tpl.html',
            controller: 'UserCtrl'
          }
        }
      })
        .state('cms.home', {
          url: '?page',
          resolve: {
            stories: ['Story', '$stateParams', '$rootScope', function (Story, $stateParams, $rootScope) {
              var params = { limit: ITEMS_PER_PAGE };
              if ($stateParams.page) {
                angular.extend(params, { skip: ($stateParams.page - 1) * ITEMS_PER_PAGE });
              }
              return Story.query(params).$promise.then(function (stories) {
                if ($stateParams.page) {
                  $rootScope.newStoriesLoaded = true;
                }
                return stories;
              });
            }],
            storyCount: ['Story', function (Story) {
              return Story.count().$promise.then(function (count) {
                return count[0]; // wtf why is this an array
              });
            }]
          },
          views: {
            'mainContent': {
              templateUrl: 'cms/story/story_list.tpl.html',
              controller: 'StoriesCtrl'
            },
            'sidebarContent': {
              templateUrl: 'cms/sidebar.tpl.html'
            }
          }
        })
        .state('cms.story', {
          abstract: true,
          url: '^/cms/stories'
        })
          .state('cms.story.edit', {
            url: '/:storyId/edit',
            resolve: {
              canAuthor: ['$q', 'user', function ($q, user) {
                if (!user.canAuthor) {
                  return $q.reject('You do not have permission to author posts!');
                }
                return true;
              }],
              story: ['$q', '$stateParams', 'Story', 'user', function ($q, $stateParams, Story, user) {
                return Story.get({ id: $stateParams.storyId }).$promise.then(function (story) {
                  if (!user.isAdmin) {
                    if (angular.isObject(story.author) && story.author.id !== user.id) {
                      return $q.reject();
                    }
                  }
                  return story;
                });
              }]
            },
            onEnter: ['$state', 'StoryEditor', 'story', function ($state, StoryEditor, story) {
              console.debug('onEnter');
              return StoryEditor.onEnter(story, function onClose(_newState) {
                $state.go('cms.home');
              });
            }],
            onExit: ['StoryEditor', function (StoryEditor) {
              StoryEditor.onExit();
            }]
          })
        .state('cms.user', {
          abstract: true,
          url: '^/cms/users'
        })
          .state('cms.user.profile', {
            url: '/profile/edit',
            resolve: {
              user: ['user', function (user) {
                // Yes, we're just returning the same object. There is a reason for this; ui-router only allows
                // inherited resolves of about ~3 levels deep (at least when I last tested it)
                // so just in case we ever want to add more child states...
                return user;
              }]
            },
            onEnter: ['$state', 'ProfileEditor', 'user', function ($state, ProfileEditor, user) {
              return ProfileEditor.onEnter(user, function onClose(_newState) {
                $state.go('cms.home');
              });
            }],
            onExit: ['ProfileEditor', function (ProfileEditor) {
              ProfileEditor.onExit();
            }]
          })
          .state('cms.user.manage', {
            url: '/manage',
            resolve: {
              isAdmin: ['$q', 'user', function ($q, user) {
                if (!user.isAdmin) {
                  return $q.reject('You are not an administrator!');
                }
                return true;
              }],
              users: ['User', function (User) {
                return User.query().$promise;
              }]
            },
            views: {
              'mainContent@cms': {
                templateUrl: 'cms/user/user_list.tpl.html',
                controller: 'UserManageCtrl'
              },
              'sidebarContent@cms': {
                templateUrl: 'cms/user/user_sidebar.tpl.html'
              }
            }
          })
    ;
    $urlRouterProvider.otherwise('/cms');
  }])

  .run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.newStoriesLoaded = false;

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      // For now, until I figure out how I really want to do error handling...
      if (toState.name !== 'cms.home') {
        $state.go('cms.home');
      } else {
        $state.reload();
      }
    });
  }])

  .controller('CMSCtrl', ['$scope', '$state', 'Story', function ($scope, $state, Story) {
    $scope.user = null;
    $scope.isAdmin = false;
    $scope.canAuthor = false;

    $scope.createStory = function () {
      var story = new Story();
      story.$save().then(function (_story) {
        $state.go('cms.story.edit', { storyId: _story.id })
      });
    };
  }])

  .controller('UserCtrl', ['$scope', 'user', function ($scope, user) {
    $scope.user = user;
    $scope.isAdmin = user.isAdmin === true;
    $scope.canAuthor = user.canAuthor === true;
  }])

  .controller('StoriesCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'ITEMS_PER_PAGE', 'stories', 'storyCount', function ($scope, $timeout, $state, $stateParams, ITEMS_PER_PAGE, stories, storyCount) {
    $scope.stories = stories;
    $scope.totalStories = storyCount;
    $scope.currentPage = $stateParams.page || 1;
    $scope.itemsPerPage = ITEMS_PER_PAGE;
    $timeout(function () {
      $scope.newStoriesLoaded = false;
    }, 100);

    $scope.deleteStory = function (story) {
      story.$delete().then(function (_story) {
        // $state.reload(); // doesn't seem to be working as expected -- doesn't seem to reload the views!?
        $scope.stories = $.grep(stories, function (o, i) {
          return o.id === _story.id;
        }, true);
      });
    };

    $scope.reloadStories = function () {
      $timeout(function () {
        $state.go('cms.home', { page: $scope.currentPage });
      }, 1);
    };
  }])

  .controller('UserManageCtrl', ['$scope', '$state', 'User', 'users', function ($scope, $state, User, users) {
    $scope.users = users;

    $scope.updateUser = function (_user) {
      _user.$update();
    };
    $scope.deleteUser = function (_user) {
      _user.$delete().then(function () {
        // $state.reload(); // doesn't seem to be working as expected -- doesn't seem to reload the views!?
        $scope.users = $.grep(users, function (o, i) {
          return o.id === _user.id;
        }, true);
      });
    };
  }])

  .filter('default', function () {
    return function (value, defaultValue) {
      if (angular.isDefined(value) && value !== null && value !== '') {
        return value;
      } else {
        return defaultValue;
      }
    };
  })

  .filter('blurbify', function () {
    return function (value) {
      var s = $(value).text(),
        thirtyWords = s.split(' ').slice(0,29).join(' ');
      if (thirtyWords[thirtyWords.length-1] !== '.') {
        thirtyWords += '...';
      }
      return thirtyWords;
    };
  })

;
})();
