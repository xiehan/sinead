(function() {
'use strict';


angular
  .module('sineadCMS.modal.profileEditor', [
    'ui.router',
    'mm.foundation',
    'sineadCMS.modal'
  ])

  .value('profileEditorDefaultOptions', {
    backdrop: true,
    keyboard: true,
    templateUrl: 'cms/user/profile_editor.tpl.html',
    controller: 'ProfileEditorCtrl'
  })

  .service('ProfileEditor', ['GenericModal', 'profileEditorDefaultOptions', function (GenericModal, profileEditorDefaultOptions) {
    var ProfileEditor = new GenericModal();
    return {
      onEnter: function (user, onClose) {
        ProfileEditor.onEnter();
        // necessary so the modal controller gets injected with all the data we need
        var dialogOptions = angular.extend({}, profileEditorDefaultOptions, {
          resolve: {
            user: function () {
              return user;
            }
          }
        });
        ProfileEditor.openModal(dialogOptions, onClose);
      },
      onExit: function () {
        ProfileEditor.onExit();
      }
    };
  }])

  .controller('ProfileEditorCtrl', ['$scope', '$modalInstance', 'user', function ($scope, $modalInstance, user) {
    $scope.user = user;

    $scope.close = function () {
      user.$update().then(function () {
        $modalInstance.close();
        $scope.$destroy();
      });
    };
    $scope.cancel = function () {
      $modalInstance.dismiss();
      $scope.$destroy();
    };
  }])

;
})();
