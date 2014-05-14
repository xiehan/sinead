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
    'sineadCMS.models'
  ])

  .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    console.debug('config for CMS');
    $stateProvider
      .state('main', {
        url: '/cms',
        views: {
          '': {
            templateUrl: 'cms/index.tpl.html',
            controller: 'MainCtrl'
          }
        }
      })
    ;
    $urlRouterProvider.otherwise('/cms');
  }])

  .controller('CMSCtrl', ['$scope', function ($scope) {
    console.debug('Initialized!');
  }])

  .controller('MainCtrl', ['$scope', function ($scope) {
    console.debug('template lives');
  }])

;
})();
