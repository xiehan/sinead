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

  count: function (req, res) {
    var where = {},
      filter = req.param('filter'),
      user = req.param('author');
    if (req.get('Referer').indexOf('/cms') < 0) { // @TODO find a better way to do this
      where.publishAt = { '<=': (new Date()) };
    }
    if (filter) {
      if (filter === 'published') {
        where.publishAt = { '<=': (new Date()) };
      } else if (req.get('Referer').indexOf('/cms') >= 0) {
        if (filter === 'draft') {
          where.publishAt = null;
        } else if (filter === 'scheduled') {
          where.publishAt = { '>': (new Date()) };
        }
      }
    }
    if (user) {
      where.author = user;
    }
    Story.count().where(where).exec(function (err, num) {
      if (err) {
        return res.send(500, err);
      }
      return res.json({ total: num });
    });
  },

  findAllByUser: function (req, res) {
    var targetUserId = req.param('id'),
      where = { author: targetUserId },
      sort = 'createdAt DESC',
      skip = req.param('skip') || 0,
      limit = req.param('limit') || 10,
      filter = req.param('filter');
    if (req.get('Referer').indexOf('/cms') < 0) { // @TODO find a better way to do this
      where.publishAt = { '<=': (new Date()) };
      sort = 'publishAt DESC';
    }
    if (filter) {
      if (filter === 'published') {
        where.publishAt = { '<=': (new Date()) };
      } else if (req.get('Referer').indexOf('/cms') >= 0) {
        if (filter === 'draft') {
          where.publishAt = null;
        } else if (filter === 'scheduled') {
          where.publishAt = { '>': (new Date()) };
        }
      }
    }
    if (typeof targetUserId !== 'undefined' && targetUserId !== null) {
      User.findOneById(targetUserId).then(function (user) {
        if (!user) { // not sure if this can happen in the promise-based model?
          return res.send(404, err);
        }

        var stories = Story.find().where(where).sort(sort).skip(skip).limit(limit).then(function (stories) {
          return stories;
        }).fail(function (err) {
          // Unexpected error occurred-- skip to the app's default error (500) handler
          return res.send(500, err);
        });

        return [stories, user];
      }).spread(function (stories, user) {
        for (var index in stories) {
          stories[index].author = user;
        }
        return res.json(stories, 200);
      }).fail(function (err) {
        // Unexpected error occurred-- skip to the app's default error (500) handler
        return res.send(500, err);
      });
    } else {
      return res.send(400, 'You must supply a user ID to retrieve stories for!');
    }
  },

  find: function (req, res) {
    var targetStoryId = req.param('id'),
      skip = req.param('skip') || 0,
      limit = req.param('limit') || 5,
      filter = req.param('filter');
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
      var where = {},
        sort = 'createdAt DESC';
      if (req.get('Referer').indexOf('/cms') < 0) { // @TODO find a better way to do this
        where.publishAt = { '<=': (new Date()) };
        sort = 'publishAt DESC';
      }
      if (filter) {
        if (filter === 'published') {
          where.publishAt = { '<=': (new Date()) };
        } else if (req.get('Referer').indexOf('/cms') >= 0) {
          if (filter === 'draft') {
            where.publishAt = null;
          } else if (filter === 'scheduled') {
            where.publishAt = { '>': (new Date()) };
          }
        }
      }
      Story.find().where(where).sort(sort).skip(skip).limit(limit).then(function (stories) {
        var toFindAuthorHash = {},
          where = { or: [] };
        // TODO integrate underscore or something to make looping easier
        for (var i = 0; i < stories.length; i++) {
          var userId = stories[i].author;
          if (typeof toFindAuthorHash[userId] === 'undefined') {
            toFindAuthorHash[userId] = userId;
            where.or.push({ id: userId });
          }
        }
        if (where.or.length === 1) {
          where = where.or[0];
        } else if (where.or.length === 0) {
          where = {};
        }
        var users = User.find().where(where).then(function (users) {
          return users;
        }).fail(function (err) {
          // Unexpected error occurred-- for now, just return the story as-is
          return null;
        });
        return [stories, users];
      }).spread(function (stories, users) {
        var foundAuthorsHash = {};
        // THIS IS REALLY DUMB. There has to be a better way to do this.
        for (var j = 0; j < users.length; j++) {
          foundAuthorsHash[users[j].id] = users[j];
        }
        for (var k = 0; k < stories.length; k++) {
          stories[k].author = foundAuthorsHash[stories[k].author];
        }
        return res.json(stories, 200);
      }).fail(function (err) {
        // Unexpected error occurred-- skip to the app's default error (500) handler
        return res.send(500, err);
      });
    }
  },

  create: function (req, res) {
    // @TODO parse relevant params and pass them to create
    Story.create({ author: req.user.id }).done(function (err, story) {
      if (err) {
        return res.send(500, err);
      }
      return res.json(story, 201);
    });
  }

};
