/**
 * Story
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var _ = require('underscore');

module.exports = {

  attributes: {
    author: {
      type: 'integer',
      index: true,
      notEmpty: true
    },
    title: {
      type: 'string'
    },
    content: {
      type: 'text'
    },
    publishAt: {
      type: 'datetime'
    }
  },

  beforeValidation: function (values, next) {
    if (!_.isUndefined(values.author)) {
      if (_.isObject(values.author)) {
        values.author = values.author.id;
      } else if (_.isNaN(values.author) || !_.isNumber(values.author)) {
        delete values.author; // this shouldn't happen, but if it ever does, just ignore the value altogether
      }
    }
    delete values.createdAt;
    delete values.updatedAt;
    next();
  },

  beforeUpdate: function (values, next) {
    if (values.publishAt) {
      values.publishAt = values.publishAt.slice(0, 19).replace('T', ' ');
    }
    next();
  }

};
