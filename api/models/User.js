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
      defaultsTo: true
    },
    isVerified: {
      type: 'boolean',
      defaultsTo: true
    },
    canAuthor: {
      type: 'boolean',
      defaultsTo: true
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
  beforeCreate: function (values, next) {
    hashPassword(values, next);
  },
  beforeUpdate: function (values, next) {
    if (values.createdAt) {
      values.createdAt = values.createdAt.slice(0, 19).replace('T', ' ');
    }
    if (values.updatedAt) {
      values.updatedAt = values.updatedAt.slice(0, 19).replace('T', ' ');
    }
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
