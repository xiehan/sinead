/**
 * MainController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {
  www: function (req, res) {
    return res.view('www/index', {
      title: 'Sinead',
      ngApp: 'sineadWWW',
      ngController: 'WWWCtrl'
    });
  },

  cms: function (req, res) {
    return res.view('cms/index', {
      title: 'Sinead CMS',
      ngApp: 'sineadCMS',
      ngController: 'CMSCtrl'
    });
  }
};
