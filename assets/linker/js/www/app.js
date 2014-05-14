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
      .state('main', {
        url: '/',
        views: {
          '': {
            templateUrl: 'www/index.tpl.html',
            controller: 'MainCtrl'
          }
        }
      })
    ;
    $urlRouterProvider.otherwise('/');
  }])

  .controller('WWWCtrl', ['$scope', function ($scope) {
    console.debug('Initialized!');
  }])

  .controller('MainCtrl', ['$scope', function ($scope) {
    console.debug('template lives');
  }])

;
})();
