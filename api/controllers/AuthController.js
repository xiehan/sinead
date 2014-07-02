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
      bodyId: 'signup'
    });
  },
  signupProcess: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/cms');
    }
    User.findOne({ email: req.body.username }).done(function (err, count) {
      if (err) {
        return next(err);
      }
      if (count > 0) {
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
};

module.exports = AuthController;
