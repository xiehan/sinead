angular.module('cms-templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('cms/index.tpl.html',
    "<!-- Nav Bar -->\n" +
    "<nav class=\"row\">\n" +
    "  <div class=\"large-12 columns\">\n" +
    "    <div class=\"nav-bar right\">\n" +
    "      <ul class=\"button-group\">\n" +
    "        <li><a href=\"/logout\" target=\"_self\" class=\"button\">Log out</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <h1>Sinead <small>A content management system for the 21st Century.</small></h1>\n" +
    "    <hr />\n" +
    "  </div>\n" +
    "</nav>\n" +
    "<!-- End Nav -->\n" +
    "\n" +
    "\n" +
    "<!-- First Band (Image) -->\n" +
    "<div class=\"row\" ng-if=\"user\">\n" +
    "  <div class=\"large-12 columns\">\n" +
    "    <div class=\"panel callout radius\">\n" +
    "      <h2>Hello {{user.name}}</h2>\n" +
    "      <p>What would you like to do today?</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!-- Second Band-->\n" +
    "<div class=\"row\">\n" +
    "  <div id=\"sidebar\" class=\"large-3 columns\" ui-view=\"sidebarContent\" autoscroll=\"newStoriesLoaded\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div id=\"main\" class=\"large-9 columns\" ui-view=\"mainContent\">\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<!-- Footer -->\n" +
    "<footer class=\"row\">\n" +
    "  <div class=\"large-12 columns\">\n" +
    "    <hr />\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"large-6 columns\">\n" +
    "        <p>&copy; Copyright 2014 by Nara Kasbergen.</p>\n" +
    "      </div>\n" +
    "      <div class=\"large-6 columns\">\n" +
    "        <ul class=\"inline-list right\">\n" +
    "          <li><a href=\"http://nara-designs.com\" target=\"_blank\">nara-designs.com</a></li>\n" +
    "          <li><a href=\"http://xie2han4.com\" target=\"_blank\">xie2han4.com</a></li>\n" +
    "          <li><a href=\"http://twitter.com/xiehan\">@xiehan</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</footer>\n"
  );


  $templateCache.put('cms/sidebar.tpl.html',
    "<button ng-click=\"createStory()\" class=\"button expand\" ng-if=\"canAuthor\"><i class=\"fa fa-plus\"></i> Write story</button>\n" +
    "<a href=\"/cms/users/profile/edit\" class=\"button expand\"><i class=\"fa fa-user\"></i> Edit profile</a>\n" +
    "<a href=\"/cms/users/manage\" class=\"button expand\" ng-if=\"isAdmin\"><i class=\"fa fa-group\"></i> Manage users</a>\n"
  );


  $templateCache.put('cms/story/story_editor.tpl.html',
    "<form id=\"storyEditor\" role=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"small-12 large-8 columns\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <label>\n" +
    "            Story title\n" +
    "            <input type=\"text\" ng-model=\"story.title\" placeholder=\"Untitled story\" ng-blur=\"save()\" />\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <label>\n" +
    "            Story contents\n" +
    "            <textarea ui-tinymce=\"tinymceOptions\" ng-model=\"story.content\"></textarea>\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"small-12 large-4 columns\">\n" +
    "      <div class=\"row datepicker-row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <p>Please choose a time to publish your story. As soon as you set a date, your story will be scheduled to be published at this time.</p>\n" +
    "          <ul class=\"button-group\">\n" +
    "            <li><quick-datepicker date-filter=\"nowOrLater\" ng-model=\"story.publishAt\" class=\"button secondary small\"></quick-datepicker></li>\n" +
    "            <li><button ng-click=\"now()\" class=\"button secondary small\">Now</button></li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row control-row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <ul class=\"button-group\">\n" +
    "            <li>\n" +
    "              <button class=\"button success\" disabled=\"disabled\" ng-if=\"isSaving\">Saving...</button>\n" +
    "              <button class=\"button success\" ng-click=\"close()\" ng-if=\"!isSaving && isSaved\">Saved!</button>\n" +
    "              <button class=\"button\" ng-click=\"close()\" ng-if=\"!isSaving && !isSaved\">Close</button>\n" +
    "            </li>\n" +
    "            <li><button class=\"button alert\" ng-click=\"deleteStory(story)\">Delete</button></li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n" +
    "<a class=\"close-reveal-modal\" ng-click=\"cancel()\"><i class=\"fa fa-times\"></i></a>\n"
  );


  $templateCache.put('cms/story/story_list.tpl.html',
    "<article class=\"row story story-list story-feed\" ng-repeat=\"story in stories\">\n" +
    "  <div class=\"columns\" ng-class=\"{ 'large-9': ((canAuthor && story.author.id == user.id) || isAdmin), 'large-12': !((canAuthor && story.author.id == user.id) || isAdmin) }\">\n" +
    "    <h5>\n" +
    "      <a ng-href=\"/stories/{{story.id}}\" target=\"_blank\">{{story.title|default:'Untitled story'}}</a>\n" +
    "    </h5>\n" +
    "    <p ng-if=\"story.content\">{{story.content|blurbify}}</p>\n" +
    "    <p ng-if=\"!story.content\"><em>No content</em></p>\n" +
    "    <ul class=\"large-block-grid-2\">\n" +
    "      <li>\n" +
    "        <ul class=\"unstyled-list\">\n" +
    "          <li><strong>Author:</strong> {{story.author.name}}</li>\n" +
    "          <li><strong>Created:</strong> {{story.createdAt|date:'medium'}}</li>\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "      <li>\n" +
    "        <ul class=\"unstyled-list\">\n" +
    "          <li><strong>Published:</strong> <span ng-if=\"story.publishAt\">{{story.publishAt|date:'medium'}}</span><span ng-if=\"!story.publishAt\"><em>Not yet published</em></span></li>\n" +
    "          <li><strong>Last Edited:</strong> {{story.updatedAt|date:'medium'}}</li>\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "  <div class=\"large-3 columns\" ng-if=\"(canAuthor && story.author.id == user.id) || isAdmin\">\n" +
    "    <a ng-href=\"/cms/stories/{{story.id}}/edit\" class=\"button expand secondary\"><i class=\"fa fa-edit\"></i> Edit story</a>\n" +
    "    <button ng-click=\"deleteStory(story)\" class=\"button expand alert\" ng-if=\"isAdmin\"><i class=\"fa fa-trash-o\"></i> Delete story</button>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"large-12 columns\" ng-if=\"!$last\">\n" +
    "    <hr />\n" +
    "  </div>\n" +
    "</article>\n" +
    "\n" +
    "<div class=\"pagination-centered\">\n" +
    "  <pagination total-items=\"totalStories\" page=\"currentPage\" items-per-page=\"itemsPerPage\" max-size=\"7\" boundary-links=\"true\" on-select-page=\"reloadStories()\"></pagination>\n" +
    "</div>\n"
  );


  $templateCache.put('cms/user/profile_editor.tpl.html',
    "<form id=\"profileEditor\" name=\"profileForm\" role=\"form\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"small-12 large-8 columns\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <label>\n" +
    "            Name or alias\n" +
    "            <input type=\"text\" ng-model=\"user.name\" required />\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <label>\n" +
    "            E-mail address (used as your username)\n" +
    "            <input type=\"email\" ng-model=\"user.email\" required />\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <label>Twitter username</label>\n" +
    "          <div class=\"row collapse\">\n" +
    "            <div class=\"small-1 columns\">\n" +
    "              <span class=\"prefix\">@</span>\n" +
    "            </div>\n" +
    "            <div class=\"small-11 columns\">\n" +
    "              <input type=\"text\" ng-model=\"user.twitter\" maxlength=\"15\" />\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"small-12 columns\">\n" +
    "          <label>\n" +
    "            Personal website\n" +
    "            <input type=\"url\" ng-model=\"user.website\" />\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"row control-row\">\n" +
    "    <div class=\"small-12 columns\">\n" +
    "      <ul class=\"button-group\">\n" +
    "        <li><button class=\"button success\" ng-disabled=\"!profileForm.$valid\" ng-click=\"close()\">Save</button></li>\n" +
    "        <li><button class=\"button secondary\" ng-click=\"cancel()\">Cancel</button></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n" +
    "<a class=\"close-reveal-modal\" ng-click=\"cancel()\"><i class=\"fa fa-times\"></i></a>\n"
  );


  $templateCache.put('cms/user/user_list.tpl.html',
    "<form id=\"userList\" role=\"form\">\n" +
    "  <table class=\"full-width\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>ID</th>\n" +
    "        <th>Name</th>\n" +
    "        <th nowrap>E-mail address</th>\n" +
    "        <th nowrap>Can author</th>\n" +
    "        <th nowrap>Is admin</th>\n" +
    "        <th>Remove</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"_user in users\">\n" +
    "        <td>{{_user.id}}</td>\n" +
    "        <td>{{_user.name}}</td>\n" +
    "        <td>{{_user.email}}</td>\n" +
    "        <td><label><input type=\"checkbox\" ng-model=\"_user.canAuthor\" ng-change=\"updateUser(_user)\" /></label></td>\n" +
    "        <td><input type=\"checkbox\" ng-model=\"_user.isAdmin\" ng-change=\"updateUser(_user)\" /></td>\n" +
    "        <td><i ng-if=\"_user.id != user.id\" ng-click=\"deleteUser(_user)\" class=\"fa fa-trash-o\"></i></td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</form>\n"
  );

}]);
