/**
 * MainController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
  www: function (req, res) {
    return res.view('www/index', {
      title: sails.config.appName,
      ngApp: 'sineadWWW',
      ngController: 'WWWCtrl',
      bodyId: 'www',
      useFullLayout: true
    });
  },

  cms: function (req, res) {
    return res.view('cms/index', {
      title: sails.config.appName + ' CMS',
      ngApp: 'sineadCMS',
      ngController: 'CMSCtrl',
      bodyId: 'cms',
      useFullLayout: true
    });
  }
};
