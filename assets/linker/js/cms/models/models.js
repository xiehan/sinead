(function () {
'use strict';

angular
  .module('sineadCMS.models', [
    'ngResource'
  ])

  .factory('User', ['$resource', function ($resource) {
    return $resource('/api/user/:id/:verb', { id: '@id' }, {
      update: {
        method: 'PUT'
      },
      identify: {
        method: 'GET',
        params: {
          verb: 'identify'
        }
      }
    });
  }])

  .factory('Story', ['$resource', function ($resource) {
    return $resource('/api/story/:id', { id: '@id' }, {
      update: {
        method: 'PUT'
      }
    });
  }])

;
})();
