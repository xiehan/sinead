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
    'sineadCMS.modal.storyEditor'
  ])

  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
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
          url: '',
          resolve: {
            stories: ['Story', function (Story) {
              return Story.query();
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

  .controller('UserCtrl', ['$scope', 'user', function ($scope, user) {
    $scope.user = user;
    $scope.isAdmin = user.isAdmin === true;
    $scope.canAuthor = user.canAuthor === true;
  }])

  .controller('StoriesCtrl', ['$scope', 'stories', function ($scope, stories) {
    $scope.stories = stories;
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
