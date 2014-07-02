// Credit:
// @theangryangel https://gist.github.com/theangryangel/5060446
// @Mantish https://gist.github.com/Mantish/6366642
// @anhnt https://gist.github.com/anhnt/8297229

var passport = require('passport');

var AuthController = {
  login: function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/cms');
    }
    res.view({
      bodyId: 'login',
      message: req.flash('error') || req.flash('message'),
      username: req.flash('username')
    });
  },
  loginProcess: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/cms');
    }
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('username', req.body.username);
        req.flash('message', info.message);
        return res.redirect('/login');
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/cms');
      });
    })(req, res, next);
  },
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },
  signup: function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect('/cms');
    }
    res.view({
      bodyId: 'signup',
      message: req.flash('error'),
      name: req.flash('name'),
      username: req.flash('username'),
      recaptcha_form: sails.config.recaptcha ? sails.config.recaptcha.toHTML({ message: req.flash('recaptchaErr') }) : undefined
    });
  },
  signupProcess: function (req, res, next) {
    function processSignup() {
      if (req.body.password != req.body.password2) {
        // Redisplay the form
        req.flash('name', req.body.name);
        req.flash('username', req.body.username);
        req.flash('error', 'Your passwords do not match. Please try again.');
        return res.redirect('/signup');
      }
      User.findOne({ email: req.body.username }).done(function (err, count) {
        if (err) {
          return next(err);
        }
        if (count > 0) {
          req.flash('username', req.body.username);
          req.flash('error', 'A user with this e-mail address already exists. Please log in instead.');
          return res.redirect('/login');
        }
        User.create({
          'email': req.body.username,
          'password': req.body.password,
          'name': req.body.name
        }).exec(function (err) {
          req.flash('username', req.body.username);
          return res.redirect('/login');
        });
      });
    }

    if (req.isAuthenticated()) {
      return res.redirect('/cms');
    }
    if (sails.config.recaptcha) {
      var data = {
        remoteip:  req.connection.remoteAddress,
        challenge: req.body.recaptcha_challenge_field,
        response:  req.body.recaptcha_response_field
      };
      sails.config.recaptcha.verify(data, function (err) {
        if (err) {
          // Redisplay the form
          req.flash('name', req.body.name);
          req.flash('username', req.body.username);
          req.flash('error', 'There was a problem validating the CAPTCHA. Please try again.');
          req.flash('recaptchaErr', err.message);
          return res.redirect('/signup');
        } else {
          processSignup();
        }
      });
    } else {
      processSignup();
    }
  }
};

module.exports = AuthController;
