angular.module('www-templates').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('www/index.tpl.html',
    "<!-- Nav Bar -->\n" +
    "<nav class=\"row\">\n" +
    "  <div class=\"large-12 columns\">\n" +
    "    <div class=\"nav-bar right\">\n" +
    "      <ul class=\"button-group\">\n" +
    "        <li ng-if=\"loggedIn\"><a href=\"/cms\" target=\"_self\" class=\"button\">CMS</a></li>\n" +
    "        <li ng-if=\"!loggedIn\"><a href=\"/signup\" target=\"_self\" class=\"button\">Sign up</a></li>\n" +
    "        <li ng-if=\"!loggedIn\"><a href=\"/login\" target=\"_self\" class=\"button\">Log in</a></li>\n" +
    "        <li ng-if=\"loggedIn\"><a href=\"/logout\" target=\"_self\" class=\"button\">Log out</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "    <h1>Sinead <small>A content management system for the 21st Century.</small></h1>\n" +
    "    <hr />\n" +
    "  </div>\n" +
    "</nav>\n" +
    "<!-- End Nav -->\n" +
    "\n" +
    "\n" +
    "<!-- Main Page Content and Sidebar -->\n" +
    "<div class=\"row\">\n" +
    "\n" +
    "  <!-- Main Blog Content -->\n" +
    "  <div id=\"main\" class=\"large-9 columns\" role=\"content\" ui-view=\"mainContent\" autoscroll=\"newStoriesLoaded\">\n" +
    "  </div>\n" +
    "  <!-- End Main Content -->\n" +
    "\n" +
    "  <!-- Sidebar -->\n" +
    "  <aside id=\"sidebar\" class=\"large-3 columns\" ui-view=\"sidebarContent\">\n" +
    "  </aside>\n" +
    "  <!-- End Sidebar -->\n" +
    "\n" +
    "</div>\n" +
    "<!-- End Main Content and Sidebar -->\n" +
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
    "</footer>\n" +
    "<!-- End Footer -->\n"
  );


  $templateCache.put('www/sidebar.tpl.html',
    "<div class=\"panel\">\n" +
    "  <h5>Featured</h5>\n" +
    "  <p>Bacon ipsum dolor sit amet nulla ham qui sint exercitation eiusmod commodo, chuck duis velit. Aute in reprehenderit, dolore aliqua non est magna in labore pig pork biltong. Eiusmod...</p>\n" +
    "  <a href=\"/stories/1\">Read More &rarr;</a>\n" +
    "</div>\n"
  );


  $templateCache.put('www/story/story.tpl.html',
    "<article class=\"story\" ng-class=\"{'story-list': stories}\">\n" +
    "  <h3><a ng-href=\"/stories/{{story.id}}\">{{story.title}}</a></h3>\n" +
    "  <h6><em>Written by <a ng-href=\"/authors/{{story.author.id}}\">{{story.author.name}}</a> on {{story.publishAt|date:'medium'}}.</em></h6>\n" +
    "  <div ng-bind-html=\"story.content\">\n" +
    "  </div>\n" +
    "</article>\n"
  );


  $templateCache.put('www/story/story_list.tpl.html',
    "<story ng-repeat=\"story in stories\"></story>\n" +
    "\n" +
    "<div class=\"pagination-centered\">\n" +
    "  <pagination total-items=\"totalStories\" page=\"currentPage\" items-per-page=\"itemsPerPage\" max-size=\"7\" boundary-links=\"true\" on-select-page=\"reloadStories()\"></pagination>\n" +
    "</div>\n"
  );


  $templateCache.put('www/user/profile.tpl.html',
    "<div class=\"row bump\">\n" +
    "  <div class=\"small-12 large-8 columns\">\n" +
    "    <div class=\"profile-card\">\n" +
    "      <div class=\"small-12 large-4 columns profile-picture\">\n" +
    "        <i class=\"fa fa-smile-o fa-5x\"></i>\n" +
    "      </div>\n" +
    "      <div class=\"small-12 large-8 columns profile-data\">\n" +
    "        <h4>{{author.name}} <span>Contributor</span></h4>\n" +
    "        <p><i class=\"fa fa-envelope\"></i> <span>{{author.email}}</span></p>\n" +
    "        <p ng-if=\"author.twitter\"><i class=\"fa fa-twitter\"></i> @<a ng-href=\"http://twitter.com/{{author.twitter}}\" target=\"_blank\">{{author.twitter}}</a></p>\n" +
    "        <p ng-if=\"author.website\"><i class=\"fa fa-globe\"></i> <a ng-href=\"{{author.website}}\" target=\"_blank\">{{author.website}}</a></p>\n" +
    "      </div>\n" +
    "      <div class=\"row collapse\">\n" +
    "        <ul class=\"button-group even-3\">\n" +
    "          <li><a href=\"#\" class=\"button\"> Stories <span>2 </span></a></li>\n" +
    "          <li><a href=\"#\" class=\"button\"> Comments <span>0 </span></a></li>\n" +
    "          <li><a href=\"#\" class=\"button\"> Followers <span>42 </span></a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('www/user/profile_sidebar.tpl.html',
    "<div class=\"row bump\">\n" +
    "  <div class=\"small-12 columns\">\n" +
    "    <div class=\"profile-card\">\n" +
    "      <div class=\"small-12 columns profile-data\">\n" +
    "        <h4><a ng-href=\"/authors/{{story.author.id}}\">{{story.author.name}}</a> <span>Contributor</span></h4>\n" +
    "        <p><i class=\"fa fa-envelope\"></i> <span>{{story.author.email}}</span></p>\n" +
    "        <p ng-if=\"story.author.twitter\"><i class=\"fa fa-twitter\"></i> @<a ng-href=\"http://twitter.com/{{story.author.twitter}}\" target=\"_blank\">{{story.author.twitter}}</a></p>\n" +
    "        <p ng-if=\"story.author.website\"><i class=\"fa fa-globe\"></i> <a ng-href=\"{{story.author.website}}\" target=\"_blank\">{{story.author.website}}</a></p>\n" +
    "      </div>\n" +
    "      <div class=\"row collapse\">\n" +
    "        <ul class=\"button-group even-2\">\n" +
    "          <li><a href=\"#\" class=\"button\"> Stories <span>2 </span></a></li>\n" +
    "          <li><a href=\"#\" class=\"button\"> Comments <span>0 </span></a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);
