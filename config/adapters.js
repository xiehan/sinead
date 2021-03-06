/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': process.env.DATABASE_TYPE || 'mysql',

  // Persistent adapter for DEVELOPMENT ONLY
  // (data is preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // MySQL is the world's most popular relational database.
  // Learn more: http://en.wikipedia.org/wiki/MySQL
  mysql: {
    module: 'sails-mysql',
    host: process.env.MYSQL_SERVER || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'sailsuser',
    password: process.env.MYSQL_PASSWORD || 'testTEST123', 
    database: process.env.MYSQL_DB || 'sinead_test'
  },

  mongo: {
    module: 'sails-mongo',
    url: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/sails',
    schema: true
  }
};