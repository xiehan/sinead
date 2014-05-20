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
      },
      getStories: {
        method: 'GET',
        isArray: true,
        params: {
          verb: 'get_stories'
        }
      }
    });
  }])

  .factory('Story', ['$resource', function ($resource) {
    return $resource('/api/story/:id/:verb', { id: '@id' }, {
      update: {
        method: 'PUT'
      },
      count: {
        method: 'GET',
        params: {
          verb: 'count'
        }
      }
    });
  }])

  .factory('CsrfToken', ['$resource', function ($resource) {
    return $resource('/csrfToken');
  }])

  .service('TokenService', function () {
    var token = null;

    return {
      get: function () {
        return token;
      },
      set: function (_token) {
        token = _token;
      }
    };
  })

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, TokenService) {
      return {
       'request': function (config) {
          if (config.method !== 'GET') {
            if (!config.data) {
              config.data = {};
            }
            config.data['_csrf'] = TokenService.get();
          }
          return config || $q.when(config);
        }
      };
    });
  }])

;
})();
