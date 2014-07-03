/**
 * SiteSettings
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var _ = require('underscore');

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
      max: 70,
      defaultsTo: 'A content management system for the 21st Century.'
    },
    siteDescription:  {
      type: 'string',
      max: 200
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
    useGoogleAnalytics: {
      type: 'boolean',
      defaultsTo: false
    },
    googleAnalyticsID: {
      type: 'string',
      max: 20
    },
    useTwitterCards: {
      type: 'boolean',
      defaultsTo: false
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
        description: _.isUndefined(obj.siteDescription) ? '' : obj.siteDescription,
        twitter: _.isUndefined(obj.siteTwitter) ? null : obj.siteTwitter,
        allowSignup: _.isUndefined(obj.allowSignup) ? true : obj.allowSignup,
        useGoogleAnalytics: _.isUndefined(obj.useGoogleAnalytics) ? false : obj.useGoogleAnalytics,
        GA_TRACKING_ID: _.isUndefined(obj.googleAnalyticsID) ? null : obj.googleAnalyticsID,
        useTwitterCards: _.isUndefined(obj.useTwitterCards) ? false : obj.useTwitterCards
      };
    }

  },

  beforeValidation: function (values, next) {
    delete values.createdAt;
    delete values.updatedAt;
    next();
  },

  afterUpdate: function (settings, next) {
    sails.config.refreshSiteSettings(next);
  }

};
