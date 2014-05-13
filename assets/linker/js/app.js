(function () {
'use strict';


angular
  .module('www-templates', [])
;

angular
  .module('cms-templates', [])
;

angular
  .module('sinead', [
    'ngSanitize',
    'ui.router',
    'mm.foundation',
    'www-templates',
    'cms-templates'
  ])

  .config(['$locationProvider', function ($locationProvider) {
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
  }])

;
})();
