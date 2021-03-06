/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var _ = require('underscore'),
    Recaptcha = require('re-captcha'),
    async = require('async');

module.exports.bootstrap = function (cb) {
  // ********************************************
  // Bootstrap Passport Middleware
  // Credit:
  // @theangryangel https://gist.github.com/theangryangel/5060446
  // @Mantish https://gist.github.com/Mantish/6366642
  // @anhnt https://gist.github.com/anhnt/8297229
  // @adityamukho https://gist.github.com/adityamukho/6260759
  // ********************************************
  function boostrapPassportMiddleware(done) {
    var passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

    // Passport session setup.
    // To support persistent login sessions, Passport needs to be able to
    // serialize users into and deserialize users out of the session. Typically,
    // this will be as simple as storing the user ID when serializing, and finding
    // the user by ID when deserializing.
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      User.findOne(id).done(function (err, user) {
        done(err, user);
      });
    });

    // Use the LocalStrategy within Passport.
    // Strategies in passport require a `verify` function, which accept
    // credentials (in this case, a username and password), and invoke a callback
    // with a user object. In the real world, this would query a database;
    // however, in this example we are using a baked-in set of users.
    passport.use(new LocalStrategy(function (username, password, done) {
        // Find the user by username. If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message. Otherwise, return the
        // authenticated `user`.
        User.findOne({ email: username }).done(function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) { 
            return done(null, false, { message: 'Unknown user ' + username });
          }
          user.validPassword(password, function (err, res) {
            if (err) {
              return done(err);
            }
            if (!res) {
              return done(null, false, { message: 'Invalid password' });
            }
            done(null, user);
          })
        });
      }
    ));

    done();
  }

  function setupRecaptcha(done) {
    if (sails.config.RECAPTCHA_PUBLIC_KEY && sails.config.RECAPTCHA_PRIVATE_KEY) {
      // I'm not sure if doing the following violates some sort of principle (I kind of feel like it does),
      // but if we don't do it here, we'd potentially have to re-init Recaptcha across different controllers,
      // which seems silly. It should really only have to be done once, and then be good while the app is running.
      sails.config.recaptcha = new Recaptcha(sails.config.RECAPTCHA_PUBLIC_KEY, sails.config.RECAPTCHA_PRIVATE_KEY);
    }
    done();
  }

  function processSiteSettings(settings, done) {
    sails.config.siteSettings = settings.toObject(); // intended for internal use
    sails.config.siteSettingsPublic = _.extend({
      bodyId: null,
      ngApp: null,
      ngController: null,
      useFullLayout: false
    }, settings.toDisplayObject()); // intended for external use (user-facing code)
    sails.config.refreshSiteSettings = function (next) {
      SiteSettings.findOneById(1).done(function (err, settings) {
        if (err || !settings) {
          return next(err);
        }
        sails.config.siteSettings = settings.toObject();
        sails.config.siteSettingsPublic = _.extend(sails.config.siteSettingsPublic, settings.toDisplayObject());
        next();
      });
    };
    done();
  }

  function initSiteSettings(done) {
    SiteSettings.create({
      siteTitle: sails.config.appName,
      siteEmail: sails.config.appContactEmail
    }).done(function (err, settings) {
      if (err || !settings) {
        return done(err);
      }
      processSiteSettings(settings, done);
    });
  }

  function loadSiteSettings(done) {
    SiteSettings.findOneById(1).done(function (err, settings) {
      if (err) {
        return done(err);
      }
      if (!settings) { 
        initSiteSettings(done);
      } else {
        processSiteSettings(settings, done);
      }
    });
  }

  async.parallel([
    boostrapPassportMiddleware,
    setupRecaptcha,
    loadSiteSettings
  ], cb);
};