/**
 * StoryController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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
   * (specific to StoryController)
   */
  _config: {},

  find: function (req, res) {
    var targetStoryId = req.param('id');
    if (typeof targetStoryId !== 'undefined' && targetStoryId !== null) {
      Story.findOneById(targetStoryId).then(function (story) {
        if (!story) { // not sure if this can happen in the promise-based model?
          return res.send(404, err);
        }

        var user = User.findOneById(story.author).then(function (user) {
          return user;
        }).fail(function (err) {
          // Unexpected error occurred-- for now, just return the story as-is
          return null;
        });
        return [story, user];
      }).spread(function (story, user) {
        story.author = user;
        return res.json(story, 200);
      }).fail(function (err) {
        // Unexpected error occurred-- skip to the app's default error (500) handler
        return res.send(500, err);
      });
    } else {
      var foundAuthorsHash = {};
      Story.find().where({ publishAt: { '<=': (new Date()) }}).sort('publishAt DESC').then(function (stories) {
        var promises = [],
          toFindAuthorHash = {};
        // TODO integrate underscore or something to make looping easier
        for (var i = 0; i < stories.length; i++) {
          var userId = stories[i].author;
          if (typeof toFindAuthorHash[userId] === 'undefined') {
            toFindAuthorHash[userId] = userId;
            promises.push(User.findOneById(userId).then(function (user) {
              foundAuthorsHash[userId] = user;
            }).fail(function (err) {
              // Unexpected error occurred-- for now, just return the story as-is
              return null;
            }));
          }
        }
        return [stories].concat(promises);
      }).spread(function (stories) {
        // THIS IS REALLY DUMB. There has to be a better way to do this.
        for (var j = 0; j < stories.length; j++) {
          stories[j].author = foundAuthorsHash[stories[j].author];
        }
        return res.json(stories, 200);
      }).fail(function (err) {
        // Unexpected error occurred-- skip to the app's default error (500) handler
        return res.send(500, err);
      });
    }
  }

};
