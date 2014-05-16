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

  .constant('ITEMS_PER_PAGE', 3)

  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'ITEMS_PER_PAGE', function ($locationProvider, $stateProvider, $urlRouterProvider, ITEMS_PER_PAGE) {
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
          url: '?page',
          resolve: {
            stories: ['$http', '$stateParams', '$rootScope', function ($http, $stateParams, $rootScope) {
              var config = { params: { limit: ITEMS_PER_PAGE }};
              if ($stateParams.page) {
                angular.extend(config.params, { skip: ($stateParams.page - 1) * ITEMS_PER_PAGE });
              }
              return $http.get('/api/story', config).then(function (response) {
                if ($stateParams.page) {
                  $rootScope.newStoriesLoaded = true;
                }
                return response.data;
              });
            }],
            storyCount: ['$http', function ($http) {
              return $http.get('/api/story/count').then(function (response) {
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

  .run(['$rootScope', function ($rootScope) {
    $rootScope.newStoriesLoaded = false;
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
        $state.go('www.home', { page: $scope.currentPage });
      }, 1);
    };
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
