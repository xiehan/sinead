# sinead
### A content management system for the 21st Century

_**NOTE**: After running continuously for over 3 years, the live demo was taken offline in August 2017; maintaining the Heroku instance just wasn't worth it to me anymore, and it's unlikely that I'll do work on this again anytime soon. But if you'd like to see a live demo for some reason, let me know and I can try to spin something up._

##### What is Sinead? Why this project?

I've been blogging on various platforms since I was 11 years old, but I realized recently that I'm not really excited about maintaining my blog anymore, in large part because the CMS I use (TextPattern) is so clunky and feels dated, and I don't like any of the mainstream alternatives (WordPress, Joomla, etc.). Also, I work as a developer at [NPR](http://npr.org), and I spent my first several months working on the CMS, which gave me an even deeper appreciation for how difficult it is to design a CMS that's both highly functional and highly usable. I decided it was a challenge I'd like to take on, and I was fortunate enough to have time to start on it during NPR's 10th [Serendipity Days](http://www.npr.org/blogs/inside/2011/10/14/141312774/happy-accidents-the-joy-of-serendipity-days) in May 2014.

Although I've somewhat facetiously been calling my project "A content management system for the 21st Century", I realize it's still very far from a fully-fledged product deserving of that subtitle. My focus so far has mainly been on developing an architecture that makes it easy to expand functionality and iterate over ideas, so it may be more appropriate to call it "An environment for prototyping a content management system for the 21st Century".

##### Why the name 'Sinead'?

At NPR, our CMS is codenamed 'Seamus', so when I was using NPR's Serendipity Days to work on a CMS project, I felt that name-wise, it should somehow be related to Seamus. I ended up sticking with the Gaelic theme but wanted mine to be female, so that's why I landed on the name 'Sinead'. ('Seamus' is the Gaelic equivalent of 'James', and 'Sinead' is the equivalent of 'Jane' or 'Janet'.)


---

### Backend architecture

Sinead was built using [Sails](http://sailsjs.org), which is built on top of the [Express](http://expressjs.com) framework for [Node.js](http://nodejs.org). The great thing about Sails is that it was optimized with a REST API in mind, and comes with a lot of built-in functionality to automatically generate API endpoints and basic controllers for each of your data models. I've done a lot to harness this already and will certainly continue to do so in the future.

The only problem with Sails is that the current stable release still hasn't implemented the ability to link between data models (ie. JOINs). I know it's in the works and currently in the release-candidate version; as soon as that functionality is released to the stable branch, I plan to implement it. Until then, I'm putting adding any more data models (such as tags and categories) on hold, as it's not worth it to me to add all of the additional manual work to simulate JOINs.

Although Sails come with an ORM and is therefore ideally database-agnostic, Sinead has currently only been proven to work with MySQL databases. I tried Mongo but was running into problems associating stories with users. Upgrading to the new version of Sails may solve this problem, so I also don't plan to spend any more time on debugging Mongo integration until then.

Authentication is handled using [Passport](http://passportjs.org). It currently uses a simple local strategy, but I'd like to expand to full OAuth support in the future.


---

### Frontend architecture and visual design/UI framework

The frontend is almost entirely implemented in [AngularJS](http://angularjs.org); although Express/Sails do come with a basic built-in method for rendering views and partials, I've made use of it only minimally &mdash; essentially only to render the base index.html file, as well as the two Signup and Login views (but I may investigate bringing those into Angular soon; not sure yet).

Because the two frontends (what I've nicknamed 'WWW' for the web-facing side, and 'CMS' for the internal content tool) are both still pretty minimal so far, I haven't spent that much time working out a formal frontend architecture, and so the current file/folder setup that you see (mainly in `assets/linker/js` and `assets/linker/templates`) is still largely subject to change. The only semi-conscious decision I've made is separating WWW and CMS into two completely separate apps, and even that is something I'd like to revisit (since there is some degree of overlapping code).

The visual and UI designs are based off the [ZURB Foundation](http://foundation.zurb.com) HTML/CSS framework, with only minimal customizations. I'd like to expand on these to make them more custom (and customizable), but for right now, it isn't my biggest focus.

One thing I am making sure of, though, is that it's fully mobile-responsive. I don't feel like there are a lot of good mobile responsive CMS's out there yet, so that's where I'd like to try to set Sinead apart.


---

### Deployment

In its current state, Sinead is optimized for deployment on [Heroku](http://heroku.com). Other methods of deployment (Nodejitsu, AWS, etc.) are also possible, but I haven't tested nor optimized the configuration settings for them yet.

The good news is that if uptime and page load speed aren't critical, then it's possible to run a Sinead-powered blog on Heroku for free, as long as you use all of the most minimal settings. I largely copied my deployment settings from [heroku-sails](https://github.com/chadn/heroku-sails), with all credit due Chad, but essentially, you'll need to do the following:

1. Create a Heroku account
2. Install [Heroku Toolbelt](https://toolbelt.heroku.com/) on your local machine
3. Type `heroku login` on the command line and add your SSH key(s)
4. If you haven't already, Git clone or fork this repository and `cd` to the project's root directory
5. `heroku apps:create <APP-NAME> --buildpack https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git`, replacing `<APP-NAME>` with whatever you want your app name and Herokuapp.com URL to be
  * If you've already created the app previously, then do `heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git`
6. `heroku addons:add cleardb` to add ClearDB for a (free) MySQL database, unless you already have a MySQL setup you can use
7. (OPTIONAL) `heroku addons:add papertrail` for a free and easy-to-use interface to access your logs (I recommend it &mdash; I didn't think I'd need it initially but it turned out to be a lifesaver)
8. `heroku config:set PORT=80`
9. `heroku config:set NODE_ENV=development` (currently production mode isn't working)
10. `heroku config:set DATABASE_TYPE=mysql`
11. Run `heroku config | grep CLEARDB_DATABASE_URL`, then use the results to set the following Heroku config vars:
  * `MYSQL_DB`
  * `MYSQL_PASSWORD`
  * `MYSQL_SERVER`
  * `MYSQL_USER`
12. (OPTIONAL) If you want to use a captcha on the signup form, then sign up for your API keys at [google.com/recaptcha](https://www.google.com/recaptcha/) and `heroku config:set RECAPTCHA_PUBLIC_KEY=` your public key, and `heroku config:set RECAPTCHA_PRIVATE_KEY=` your private key
13. We're ready to deploy! Run `git push heroku master`
14. Finally, if you want to ensure that you can run your app on the free tier, run `heroku ps:scale web=1`

If you followed all the steps, you should be good to go!

In the future, I'll make sure the project gets optimized for deployment to other platforms, but for now, Heroku has proven to be the easiest (and free!) platform that supports rapid iterations, so it isn't the biggest priority for me for the time being.


---

### Development

If you either want to fork Sinead to add your own customizations or contribute to the main project here, you're going to need the following tools:

1. [Node.js](http://nodejs.org) &mdash; see their website for the most up-to-date installation instructions
2. Sails: `sudo npm install -g sails`
3. Grunt: `sudo npm install -g grunt-cli`
4. Bower: `sudo npm install -g bower`

Once you clone or fork this repository, you'll need to run `npm install` and `bower install` in this directory to make sure you have all of the required dependencies.

Sails runs our main development Grunt task anytime it's running and detects changes, but it's not foolproof, so you can also trigger the refresh of static assets using the command-line command `grunt build`.


---

### To-do List

Because there's so much, I've broken it up into three categories: short-term, medium-term, and long-term.

#### Short-term

* Figure out what to do with that sidebar on the WWW side &mdash; whether it's actually adding the ability to feature a story, or something else
* Add AngularJS to the sign-up and login forms for improved front-end form validation
* Get production mode working (with minified CSS/JS)
* Make sure the CMS JS code doesn't get loaded when rendering the WWW side (and ideally vice-versa, although that isn't as important)
* Add a subtle icon to the WWW side that lets a logged-in story author go straight into that story in the CMS to edit it
* Add a basic preview mode to stories in the CMS
* Add support for prev/next navigation on individual story pages, ideally with swipe for mobile devices
* Add support for slug-based story URLs (maybe)
* Add the ability to add a corrections block to a published story
* Figure out how to add Twitter cards to individual stories and author profiles
* Work on integrating other social sharing tools, but keeping them configurable
* Investigate adding an API key check for POST/PUT/DELETE requests for added security
* Better (custom) error pages / error handling in general
* See if it's possible to get this working with MongoDB (and possibly other database types besides MySQL)

#### Medium-term

* Improved visual/UI designs with future customizability in mind
* Add a way to edit custom CSS from inside the CMS
* Ability to add (invite) users from inside the CMS (they'll be sent an e-mail and if they confirm, their account is created with posting rights automatically)
* E-mail confirmation of new user sign-ups
* E-mail notifications (and notifications in general)
* Expand OAuth support
* Some basic way(s) to upload/embed media in stories
* Add many more configurable settings to the admin dashboard (eg. allowing admins to choose between schemas for formatting story URLs)
* Add some Textpattern-style user permission levels
* Add a way to embed comments via a third-party service (eg. Disqus, Livefyre, etc.)
* RSS feeds (maybe &mdash; does anyone still care about RSS? serious question!)
* Once Sails v0.10 is released as a stable version: support for tags, categories, and some other basic data models
* Investigate and if possible integrate other deployment options besides Heroku
* Continue to investigate and make sure it's possible to use other database types besides MySQL

#### Long-term

* A native commenting system (maybe &mdash; not actually sure if I really want to open that can of worms)
* A much more configurable way to upload/embed media in stories (eg. add a photo to a specific paragraph and choose to display on the left vs. on the right)
* A much more interactive preview mode (possibly in conjunction with the previous bullet point)
* Add a way to edit layouts/partials from inside the CMS, ideally with live previews
* Add a way to generate and edit additional views from inside the CMS (ie. NPR's aggregations, AKA "aggs")
* Add a way to attribute a story to more than one author (ie. journalism-style bylines)
* Continue to expand user levels, and make them more configurable
* Add support for localization
* Investigate caching and performance
* Test cases...


---

### Questions?

* Nara: <nara@nara-designs.com>
