// Credit:
// @theangryangel https://gist.github.com/theangryangel/5060446
// @Mantish https://gist.github.com/Mantish/6366642
// @anhnt https://gist.github.com/anhnt/8297229

var passport = require('passport');

var AuthController = {
  login: function (req, res) {
    var data = {
      username: req.flash('username')
    }
    var msg = req.flash('error') || req.flash('message');
    if (msg && msg.length > 0) {
      data.message = req.flash('error') || req.flash('message');
    }
    res.view(data);
  },
  loginProcess: function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.view('auth/login', {
          username: req.body.username,
          message: info.message
        });
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
    res.view();
  },
  signupProcess: function (req, res, next) {
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
