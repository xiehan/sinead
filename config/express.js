var swagger = require('swagger-node-express'),
  passport = require('passport');

module.exports.express = {
  customMiddleware: function (app) {
  	// Swagger integration
  	swagger.setAppHandler(app);
  	swagger.configureSwaggerPaths('', '/api-docs', '');

    // Passport Auth Middleware
    // Credit:
    // @theangryangel https://gist.github.com/theangryangel/5060446
    // @Mantish https://gist.github.com/Mantish/6366642
    // @anhnt https://gist.github.com/anhnt/8297229
    app.use(passport.initialize());
    app.use(passport.session());
  }
};
