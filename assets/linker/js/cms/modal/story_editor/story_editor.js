(function() {
'use strict';


angular
  .module('sineadCMS.modal.storyEditor', [
    'ui.router',
    'mm.foundation',
    'ngQuickDate',
    'sineadCMS.modal'
  ])

  .value('storyEditorDefaultOptions', {
    backdrop: true,
    keyboard: true,
    templateUrl: 'cms/story/story_editor.tpl.html',
    controller: 'StoryEditorCtrl'
  })

  .service('StoryEditor', ['GenericModal', 'storyEditorDefaultOptions', function (GenericModal, storyEditorDefaultOptions) {
    var StoryEditor = new GenericModal();
    return {
      onEnter: function (story, onClose) {
        StoryEditor.onEnter();
        // necessary so the modal controller gets injected with all the data we need
        var dialogOptions = angular.extend({}, storyEditorDefaultOptions, {
          resolve: {
            story: function () {
              return story;
            }
          }
        });
        StoryEditor.openModal(dialogOptions, onClose);
      },
      onExit: function () {
        StoryEditor.onExit();
      }
    };
  }])

  .config(function (ngQuickDateDefaultsProvider) {
    // Configure with icons from font-awesome
    return ngQuickDateDefaultsProvider.set({
      closeButtonHtml: '<i class="fa fa-times"></i>',
      buttonIconHtml: '<i class="fa fa-calendar"></i>',
      nextLinkHtml: '<i class="fa fa-chevron-right"></i>',
      prevLinkHtml: '<i class="fa fa-chevron-left"></i>'
    });
  })

  .controller('StoryEditorCtrl', ['$scope', '$timeout', 'tinymceDefaultOptions', '$modalInstance', 'story', function ($scope, $timeout, tinymceDefaultOptions, $modalInstance, story) {
    var isTimedSaving = false,
      needsTimedSave = false;
    var handleSave = function (callback) {
      $scope.isSaving = true;
      story.$update().then(function () {
        $scope.isSaving = false;
        $scope.isSaved = true;
        $timeout(function () {
          $scope.isSaved = false;
        }, 3000);
      }).then(callback);
    };
    var handleTimedSave = function (callback) {
      if (!isTimedSaving) {
        isTimedSaving = true;
        needsTimedSave = false;
        handleSave(callback);
        $timeout(function () {
          isTimedSaving = false;
          if (needsTimedSave) {
            handleTimedSave(callback);
          }
        }, 10000);
      } else {
        needsTimedSave = true;
      }
    };
    var handleAutosave = function (newValue, oldValue) {
      if (newValue !== oldValue) {
        handleSave();
      }
    };
    var handleTimedAutosave = function (newValue, oldValue) {
      if (oldValue !== null && newValue !== oldValue) {
        handleTimedSave();
      }
    };

    $scope.story = story;
    $scope.tinymceOptions = tinymceDefaultOptions;
    $scope.isSaving = false;
    $scope.isSaved = false;

    $scope.$watch('story.content', handleTimedAutosave);
    $scope.$watch('story.publishAt', handleAutosave);

    $scope.save = handleSave;

    $scope.nowOrLater = function (_date) {
      return _date >= (new Date());
    };
    $scope.now = function () {
      $scope.story.publishAt = new Date();
    };

    $scope.delete = function () {
      story.$delete().then(function (_story) {
        $scope.cancel();
      });
    };

    $scope.close = function () {
      if (needsTimedSave) {
        handleSave(function () {
          $modalInstance.close();
          $scope.$destroy();
        });
      } else {
        $modalInstance.close();
        $scope.$destroy();
      }
    };
    $scope.cancel = function () {
      $modalInstance.dismiss();
      $scope.$destroy();
    };
  }])

;
})();
