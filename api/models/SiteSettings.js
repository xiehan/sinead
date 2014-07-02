/**
 * SiteSettings
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'site_settings',

  attributes: {
    siteTitle: {
      type: 'string',
      max: 30,
      required: true
    },
    siteSubtitle:  {
      type: 'string',
      max: 100,
      defaultsTo: 'A content management system for the 21st Century.'
    },
    siteEmail: {
      type: 'email',
      required: true
    },
    siteTwitter: {
      type: 'string',
      alphanumeric: true,
      maxLength: 15
    },
    allowSignup: {
      type: 'boolean',
      defaultsTo: true
    },
    requireManualPostingAccessRights: {
      type: 'boolean',
      defaultsTo: true
    },

    beforeUpdate: function (values, next) {
      if (values.createdAt) {
        values.createdAt = values.createdAt.slice(0, 19).replace('T', ' ');
      }
      if (values.updatedAt) {
        values.updatedAt = values.updatedAt.slice(0, 19).replace('T', ' ');
      }
      next();
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    },

    toDisplayObject: function () {
      var obj = this.toObject();
      return {
        title: obj.siteTitle,
        subtitle: _.isUndefined(obj.siteSubtitle) ? null : obj.siteSubtitle,
        twitter: _.isUndefined(obj.siteTwitter) ? null : obj.siteTwitter,
        allowSignup: _.isUndefined(obj.allowSignup) ? true : obj.allowSignup
      };
    }

  }

};
