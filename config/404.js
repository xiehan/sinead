/**
 * Default 404 (Not Found) handler
 *
 * If no route matches are found for a request, Sails will respond using this handler.
 * 
 * This middleware can also be invoked manually from a controller or policy:
 * Usage: res.notFound()
 */

module.exports[404] = function pageNotFound(req, res) {
  /*
   * NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
   * work just like their Express equivalents to handle HTTP requests, they also simulate
   * the same interface for receiving socket messages.
   */

  if (!req.headers['x-requested-with']) {
    if (req.url.match(/\/cms\/?.*$/)) {
      if (!req.isAuthenticated()) { // @TODO Figure out how to apply our Sails policy here rather than doing this manually
        return res.forbidden('You cannot access this page if you are not logged in!');
      }
      return sails.controllers.main.cms(req, res);
    } else if (!req.url.match(/\/api\/?.*$/) &&
               !req.url.match(/\/signup\/?.*$/) &&
               !req.url.match(/\/login\/?.*/) &&
               !req.url.match(/\/logout\/?.*/)) {
      return sails.controllers.main.www(req, res);
    }
  }

  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  // If the user-agent wants a JSON response, send json
  if (req.wantsJSON) {
    return res.json(result, result.status);
  }

  res.status(result.status);
  res.render(viewFilePath, function (err) {
    // If the view doesn't exist, or an error occured, send json
    if (err) { return res.json(result, result.status); }

    // Otherwise, serve the `views/404.*` page
    res.render(viewFilePath);
  });

};