/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

  identify: function (req, res) {
    var userId;
    if (!req.isAuthenticated()) {
      return res.json({}, 200);
    }
    userId = req.user.id;
    User.findOneById(userId).exec(function (err, user) {
      // Unexpected error occurred-- skip to the app's default error (500) handler
      if (err) {
        return res.send(500, err);
      }

      // This really shouldn't happen, but just in case...
      if (!user) {
        return res.send(404, err);
      }

      return res.json(user, 200);
    });
  }

};
