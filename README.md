# sinead
### A content management system for the 21st Century

See it in action: http://sinead.herokuapp.com/

Currently, anyone can sign up but I have to individually give users access to post. Just shoot me an e-mail if you'd like posting access (as a way of testing the platform). Obviously, it isn't meant to be used as a real blog.


---

### Deployment

In its current state, Sinead is optimized for deployment on [Heroku](http://heroku.com). Other methods of deployment (Nodejitsu, AWS, etc.) are also possible, but I haven't tested nor optimized the configuration settings for them yet.

The good news is that if uptime and page load speed aren't critical, then it's possible to run a Sinead-powered blog on Heroku for free, as long as you use all of the most minimal settings. I largely copied my deployment settings from [heroku-sails](https://github.com/chadn/heroku-sails), with all credit due Chad, but essentially, you'll need to do the following:

1. Create a Heroku account
2. Install [Heroku Toolbelt](https://toolbelt.heroku.com/) on your local machine
3. Type `heroku login` on the command line and add your SSH key(s)
4. If you haven't already, Git clone or fork this repository and `cd` to the project's root directory
5. `heroku apps:create <APP-NAME> --buildpack https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git`, replacing `<APP-NAME>` with whatever you want your app name and Herokuapp.com URL to be (eg. in my case it was `sinead` for [sinead.herokuapp.com](http://sinead.herokuapp.com))
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
12. We're ready to deploy! Run `git push heroku master`
13. Finally, if you want to ensure that you can run your app on the free tier, run `heroku ps:scale web=1`

If you followed all the steps, you should be good to go!

In the future, I'll make sure the project gets optimized for deployment to other platforms, but for now, Heroku has proven to be the easiest (and free!) platform that supports rapid iterations, so it isn't the biggest priority for me for the time being.


---

### To-do List

Because there's so much, I've broken it up into three categories: short-term, medium-term, and long-term.

#### Short-term

* Clean up some of the visual/UI design elements, particularly the header/top nav, which is just not great on mobile
* Add a captcha to the sign-up form
* Get production mode working (with minified CSS/JS)
* Add a subtle icon to the WWW side that lets a logged-in story author go straight into that story in the CMS to edit it
* Add an admin dashboard to control some basic configuration settings (eg. whether or not anyone can sign up, whether or not new sign-ups automatically have posting access, whether or not anyone can edit (maybe), etc.)
* Add a basic preview mode to stories in the CMS
* Add support for prev/next navigation on individual story pages, ideally with swipe for mobile devices
* Add support for slug-based story URLs (maybe)
* Add the ability to add a corrections block to a published story
* Figure out how to add Twitter cards to individual stories (and maybe the site as a whole, but only the WWW side)
* Work on integrating other social sharing tools and Google Analytics, but keeping them configurable
* Investigate adding an API key check for POST/PUT/DELETE requests for added security
* See if it's possible to get this working with MongoDB (and possibly other database types besides MySQL)

#### Medium-term

* Improved visual/UI designs with future customizability in mind
* Add a way to edit custom CSS from inside the CMS
* Ability to add (invite) users from inside the CMS (they'll be sent an e-mail and if they confirm, their account is created with posting rights automatically)
* E-mail confirmation of new user sign-ups
* E-mail notifications (and notifications in general)
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


---

### Questions?

* Nara: <nara@nara-designs.com>
