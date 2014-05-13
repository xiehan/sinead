(function () {
'use strict';


angular
  .module('sinead')

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    console.debug('config for CMS');
    $stateProvider
      .state('cms', {
        url: '/cms',
        views: {
          '': {
            templateUrl: 'cms/index.tpl.html',
            controller: 'MainCMSCtrl'
          }
        }
      })
    ;
    $urlRouterProvider.otherwise('/cms');
  }])

  .controller('CMSCtrl', ['$scope', function ($scope) {
    console.debug('Initialized!');
  }])

  .controller('MainCMSCtrl', ['$scope', function ($scope) {
    console.debug('template lives');
  }])

;
})();
