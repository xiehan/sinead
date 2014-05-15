/**
 * Story
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

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

  beforeUpdate: function (values, next) {
    //values.author = values.author.id;
    if (values.publishAt) {
      values.publishAt = values.publishAt.slice(0, 19).replace('T', ' ');
    }
    next();
  }

};
