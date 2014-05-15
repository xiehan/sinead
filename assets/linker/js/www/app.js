(function () {
'use strict';


angular
  .module('www-templates', [])
;

angular
  .module('sineadWWW', [
    'ngSanitize',
    'ui.router',
    'mm.foundation',
    'www-templates'
  ])

  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $stateProvider
      .state('www', {
        abstract: true,
        url: '/',
        resolve: {
          user: ['$http', function ($http) {
            return $http.get('/api/user/identify').then(function onSuccess(response) {
              if (!response.data || $.isEmptyObject(response.data)) {
                return null;
              }
              return response.data;
            }, function onError(response) {
              return null;
            });
          }]
        },
        views: {
          '': {
            templateUrl: 'www/index.tpl.html',
            controller: 'UserCtrl'
          }
        }
      })
        .state('www.home', {
          url: '',
          resolve: {
            stories: ['$http', function ($http) {
              return $http.get('/api/story').then(function (response) {
                return response.data;
              });
            }]
          },
          views: {
            'mainContent': {
              templateUrl: 'www/story/story_list.tpl.html',
              controller: 'StoriesCtrl'
            },
            'sidebarContent': {
              templateUrl: 'www/sidebar.tpl.html'
            }
          }
        })
        .state('www.story', {
          url: '^/stories/:storyId',
          resolve: {
            story: ['$http', '$stateParams', function ($http, $stateParams) {
              return $http.get('/api/story/' + $stateParams.storyId).then(function (response) {
                return response.data;
              });
            }]
          },
          views: {
            'mainContent': {
              templateUrl: 'www/story/story.tpl.html',
              controller: 'SingleStoryCtrl'
            },
            'sidebarContent': {
              templateUrl: 'www/user/profile_sidebar.tpl.html',
              controller: 'SingleStoryCtrl'
            }
          }
        })
        .state('www.author', {
          url: '^/authors/:userId',
          resolve: {
            author: ['$http', '$stateParams', function ($http, $stateParams) {
              return $http.get('/api/user/' + $stateParams.userId).then(function (response) {
                return response.data;
              });
            }]
          },
          views: {
            'mainContent': {
              templateUrl: 'www/user/profile.tpl.html',
              controller: 'UserProfileCtrl'
            },
            'sidebarContent': {
              templateUrl: 'www/sidebar.tpl.html'
            }
          }
        })
    ;
    $urlRouterProvider.otherwise('/');
  }])

  .controller('WWWCtrl', ['$scope', function ($scope) {
    $scope.loggedIn = false;
    $scope.user = null;
  }])

  .controller('UserCtrl', ['$scope', 'user', function ($scope, user) {
    $scope.user = user;
    if (user) {
      $scope.loggedIn = true;
    }
  }])

  .controller('StoriesCtrl', ['$scope', 'stories', function ($scope, stories) {
    $scope.stories = stories;
  }])

  .controller('SingleStoryCtrl', ['$scope', 'story', function ($scope, story) {
    $scope.story = story;
  }])

  .controller('UserProfileCtrl', ['$scope', 'author', function ($scope, author) {
    $scope.author = author;
  }])

  .directive('story', function () {
    return {
      restrict: 'E',
      templateUrl: 'www/story/story.tpl.html',
      replace: true,
      link: function postLink($scope, $element, $attrs) {}
    };
  })

;
})();
