(function () {
'use strict';

angular
  .module('sineadCMS.models', [
    'ngResource'
  ])

  .factory('User', ['$resource', function ($resource) {
    return $resource('/api/user/:id', { id:'@id' }, {
      update: {
        method: 'PUT'
      }
    });
  }])

  .factory('Story', ['$resource', function ($resource) {
    return $resource('/api/story/:id', { id:'@id' }, {
      update: {
        method: 'PUT'
      }
    });
  }])

;
})();
