(function () {
'use strict';


angular
  .module('sinead')

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    console.debug('config for WWW');
    $stateProvider
      .state('main', {
        url: '/',
        views: {
          '': {
            templateUrl: 'www/main.tpl.html',
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
