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
      index: true
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

  // Lifecycle Callbacks
  beforeCreate: function (values, next) {
    values.uuid = uuid.v4();
    values.author = values.author.id;
  }

};
