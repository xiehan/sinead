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
      isAuthenticated: req.isAuthenticated(),
      ngController: 'WWWCtrl'
    });
  },

  cms: function (req, res) {
    return res.view('cms/index', {
      title: 'Sinead CMS',
      ngController: 'CMSCtrl'
    });
  }
};
