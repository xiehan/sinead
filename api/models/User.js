/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

function hashPassword(values, next) {
  bcrypt.hash(values.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    values.password = hash;
    next();
  });
}

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 30,
      minLength: 2
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    isVerified: {
      type: 'boolean',
      defaultsTo: false
    },
    canAuthor: {
      type: 'boolean',
      defaultsTo: false
    },
    twitter: {
      type: 'string',
      alphanumeric: true,
      maxLength: 15
    },
    website: {
      type: 'string'
      //url: true
    },

    // Override toJSON instance method to remove password value
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.updatedAt;
      return obj;
    },
    
    validPassword: function (password, callback) {
      var obj = this.toObject();
      if (callback) {
        return bcrypt.compare(password, obj.password, callback);
      }
      return bcrypt.compareSync(password, obj.password);
    }
  },

  // Lifecycle Callbacks
  beforeValidation: function (values, next) {
    delete values.createdAt;
    delete values.updatedAt;
    next();
  },

  beforeCreate: function (values, next) {
    User.count().done(function (err, count) {
      if (err) {
        return next(err);
      }
      if (!count) { // if we're the first user in the database, give us all privileges
        values.isAdmin = true;
        values.isVerified = true;
        values.canAuthor = true;
      } else { // otherwise, don't give them any privileges... just to be safe
        // for now, while there's no other way to create users than by going through the signup anyway...
        values.isAdmin = false;
        values.isVerified = false;
        values.canAuthor = false;
        var requireManualPostingAccessRights = sails.config.siteSettings.requireManualPostingAccessRights;
        if (typeof requireManualPostingAccessRights !== 'undefined') {
          values.canAuthor = !requireManualPostingAccessRights;
        }
      }
      hashPassword(values, next);
    });
  },

  beforeUpdate: function (values, next) {
    if (values.password) {
      hashPassword(values, next);
    } else {
      //IMPORTANT: The following is only needed when a BLANK password param gets submitted through a form. Otherwise, a next() call is enough.
      User.findOne(values.id).done(function (err, user) {
        if (err) {
          next(err);
        } else {
          values.password = user.password;
          next();
        }
      });
    }
  }

};
