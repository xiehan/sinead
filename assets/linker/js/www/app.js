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
                return response.data.total;
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
              controller: 'SingleStorySidebarCtrl'
            }
          },
          onEnter: ['$rootScope', '$filter', 'story', function ($rootScope, $filter, story) {
            $rootScope.isStoryPage = true;
            $rootScope.twitterCardAuthorTwitter = story.author.twitter;
            $rootScope.twitterCardTitle = $filter('shorten')(story.title, 70 - $rootScope.siteTitle.length) + ' | ' + $rootScope.siteTitle;
            $rootScope.twitterCardDescription = $filter('shorten')(story.content, 200);
          }],
          onExit: ['$rootScope', function ($rootScope) {
            $rootScope.isStoryPage = false;
            $rootScope.twitterCardTitle = null;
            $rootScope.twitterCardAuthorTwitter = null;
            $rootScope.twitterCardDescription = null;
          }]
        })
        .state('www.author', {
          url: '^/authors/:userId',
          resolve: {
            author: ['$http', '$stateParams', function ($http, $stateParams) {
              return $http.get('/api/user/' + $stateParams.userId).then(function (response) {
                return response.data;
              });
            }],
            authorStories: ['$http', '$stateParams', function ($http, $stateParams) {
              return $http.get('/api/user/' + $stateParams.userId + '/get_stories').then(function (response) {
                return response.data;
              });
            }],
            storyCount: ['$http', '$stateParams', function ($http, $stateParams) {
              return $http.get('/api/story/count?author=' + $stateParams.userId).then(function (response) {
                return response.data.total;
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
          },
          onEnter: ['$rootScope', 'author', 'storyCount', function ($rootScope, author, storyCount) {
            $rootScope.isAuthorProfile = true;
            $rootScope.twitterCardAuthorTwitter = author.twitter;
            $rootScope.twitterCardTitle = 'Author profile for ' + author.name + ' | ' + $rootScope.siteTitle;
            $rootScope.twitterCardDescription = author.name + ' is the author of ' + storyCount;
            if (storyCount === 1) {
              $rootScope.twitterCardDescription += ' story';
            } else {
              $rootScope.twitterCardDescription += ' stories';
            }
            $rootScope.twitterCardDescription += ' at ' + $rootScope.siteTitle;
            if ($rootScope.siteSubtitle) {
              $rootScope.twitterCardDescription += ': ' + $rootScope.siteSubtitle;
            }
          }],
          onExit: ['$rootScope', function ($rootScope) {
            $rootScope.isAuthorProfile = false;
            $rootScope.twitterCardAuthorTwitter = null;
            $rootScope.twitterCardTitle = null;
            $rootScope.twitterCardDescription = null;
          }]
        })
    ;
    $urlRouterProvider.otherwise('/');
  }])

  .run(['$rootScope', function ($rootScope) {
    $rootScope.loggedIn = false;
    $rootScope.isAdmin = false;
    $rootScope.canAuthor = false;
    $rootScope.newStoriesLoaded = false;
    $rootScope.siteTitle = $('#siteTitleFromServer').text();
    $rootScope.siteSubtitle = $('#siteSubtitleFromServer').text() || null;
  }])

  .controller('WWWCtrl', ['$scope', function ($scope) {
    $scope.user = null;
  }])

  .controller('UserCtrl', ['$scope', '$rootScope', 'user', function ($scope, $rootScope, user) {
    $scope.user = user;
    if (user) {
      $rootScope.loggedIn = true;
      $rootScope.isAdmin = user.isAdmin === true;
      $rootScope.canAuthor = user.canAuthor === true;
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

  .controller('SingleStorySidebarCtrl', ['$scope', '$http', 'story', function ($scope, $http, story) {
    $scope.author = story.author;
    $scope.totalStories = null;

    // I prefer not to make AJAX requests from inside controllers if I can help it, but we need the story to get the author ID
    $http.get('/api/story/count?author=' + story.author.id).then(function (response) {
      $scope.totalStories = response.data.total;
    });
  }])

  .controller('UserProfileCtrl', ['$scope', '$http', 'author', 'authorStories', 'storyCount', function ($scope, $http, author, authorStories, storyCount) {
    author.stories = authorStories;
    $scope.author = author;
    $scope.totalStories = storyCount;
    $scope.loadingMoreStories = false;
    var skip = 0;

    $scope.loadMore = function () {
      $scope.loadingMoreStories = true;
      skip += 10; // @TODO see about not hard-coding this in
      $http.get('/api/user/' + author.id + '/get_stories?skip=' + skip).then(function (response) {
        authorStories = authorStories.concat(response.data);
        $scope.author.stories = authorStories;
        $scope.loadingMoreStories = false;
      });
    };
  }])

  .directive('story', function () {
    return {
      restrict: 'E',
      templateUrl: 'www/story/story.tpl.html',
      replace: true,
      link: function postLink($scope, $element, $attrs) {}
    };
  })

  .directive('collapsedStory', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink($scope, $element, $attrs) {
        $timeout(function () {
          $('.story-content', $element).readmore();
        }, 10);
      }
    };
  }])

  .filter('shorten', function () {
    return function (value, length) {
      length = angular.isDefined(length) ? length : 200;
      var s = $.trim($('<div>').append(value).text());
      if (s.length > length) {
        var maxLength = length - 3; // 3 for the ellipses
        s = s.substring(0, maxLength);
        if (s[s.length-1] !== '.') {
          s += '...';
        }
      }
      return s.replace('"', '\"');
    };
  })

;
})();
