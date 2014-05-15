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
    var authorId = story.author.id;
    var handleSave = function () {
      if (angular.isObject(story.author)) {
        story.author = story.author.id; // I shouldn't have to do this on the front-end but I don't have time to debug Sails right now...
      } else {
        story.author = authorId;
      }
      story.$update().then(function () {
        $scope.isSaving = false;
        $scope.isSaved = true;
        $timeout(function () {
          $scope.isSaved = false;
        }, 3000);
      });
    };
    var handleAutosave = function (newValue, oldValue) {
      if (oldValue !== undefined && newValue !== oldValue) {
        $scope.isSaving = true;
        handleSave();
      }
    };

    $scope.story = story;
    $scope.tinymceOptions = tinymceDefaultOptions;

    $scope.save = handleSave;
    $scope.isSaving = false;
    $scope.isSaved = false;

    $scope.$watch('story.content', handleAutosave);
    $scope.$watch('story.publishAt', handleAutosave);

    $scope.nowOrLater = function (_date) {
      return _date >= (new Date());
    };

    $scope.close = function () {
      $modalInstance.close();
      $scope.$destroy();
    };
    $scope.cancel = function () {
      $modalInstance.dismiss();
      $scope.$destroy();
    };
  }])

;
})();
