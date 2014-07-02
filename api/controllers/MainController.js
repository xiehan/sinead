/**
 * MainController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

var _ = require('underscore');

module.exports = {
  www: function (req, res) {
    return res.view('www/index', _.extend({}, sails.config.siteSettingsPublic, {
      ngApp: 'sineadWWW',
      ngController: 'WWWCtrl',
      bodyId: 'www',
      useFullLayout: true
    }));
  },

  cms: function (req, res) {
    return res.view('cms/index', _.extend({}, sails.config.siteSettingsPublic, {
      title: sails.config.siteSettingsPublic.title + ' CMS',
      ngApp: 'sineadCMS',
      ngController: 'CMSCtrl',
      bodyId: 'cms',
      useFullLayout: true
    }));
  }
};
