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
              story: ['$stateParams', 'Story', function ($stateParams, Story) {
                return Story.get({ id: $stateParams.storyId }).$promise;
              }]
            },
            onEnter: ['$state', 'StoryEditor', 'story', function ($state, StoryEditor, story) {
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
          url: '^/cms/users',
          resolve: {
            loggedinUser: ['user', function (user) {
              return user;
            }]
          },
          views: {
            'sidebarContent': {
              templateUrl: 'cms/sidebar.tpl.html'
            }
          }
        })
          .state('cms.user.profile', {
            url: '/profile/edit',
            resolve: {
              user: ['User', 'loggedinUser', function (User, loggedinUser) {
                return User.get({ id: loggedinUser.id }).$promise;
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
              users: ['User', function (User) {
                return User.query().$promise;
              }]
            },
            views: {
              'mainContent@cms': {
                templateUrl: 'cms/user/user_list.tpl.html',
                controller: 'UserManageCtrl'
              }
            }
          })
    ;
    $urlRouterProvider.otherwise('/cms');
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

    $scope.deleteStory = function (story) {
      story.$delete().then(function (_story) {
        if ($state.is('cms.home')) {
          $state.reload();
        } else {
          $state.go('cms.home');
        }
      });
    };
  }])

  .run(['$rootScope', function ($rootScope) {
    $rootScope.newStoriesLoaded = false;
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
        $scope.$apply(function () {
          $state.reload();
        });
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
