(function() {
'use strict';


angular
  .module('sineadCMS.modal', [
    'mm.foundation',
    'ui.tinymce'
  ])

  .value('tinymceDefaultOptions', {
    theme: 'modern',
    skin: 'light',
    plugins: 'autolink link lists paste',
    menubar: false,
    toolbar: 'styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | blockquote | ' + 
      'link unlink | removeformat',
    statusbar: false,
    height: 400,
    relative_urls: false
  })

  .factory('GenericModal', ['$modal', function ($modal) {
    var GenericModal = function GenericModal() {
      this.modalInstance = null;
      this.modalIsOpen = false;
    };

    GenericModal.prototype.onEnter = function () {
      // Nothing for now...
    };

    GenericModal.prototype.onExit = function () {
      if (this.modalInstance != null && this.modalIsOpen) {
        this.modalInstance.dismiss('Closed by external state change');
      }
      this.modalInstance = null;
      this.modalIsOpen = false;
    };

    GenericModal.prototype.openModal = function (dialogOptions, onClose) {
      this.modalInstance = $modal.open(dialogOptions);
      var modal = this;
      this.modalInstance.opened.then(function () {
        modal.modalIsOpen = true;
      });
      this.modalInstance.result.then(function (result) {
        modal.modalIsOpen = false;
        if (angular.isFunction(onClose)) {
          onClose(result);
        }
      }, function (reason) {
        modal.modalIsOpen = false;
        if (angular.isFunction(onClose)) {
          onClose(reason);
        }
      });
    };

    return GenericModal;
  }])

  .config(['$stateProvider', function ($stateProvider) {
    console.debug('instantiating modal');
  }])

;
})();
