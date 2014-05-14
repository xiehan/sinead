module.exports = function (req, res, next) {
  var targetStoryId = req.param('id'),
    userId = req.user.id;

  Story.findOneById(targetStoryId).exec(function (err, story) {
    // Unexpected error occurred-- skip to the app's default error (500) handler
    if (err) {
      return next(err);
    }

    if (!story) {
      return res.notFound('The Story you are trying to edit could not be found.');
    }

    if (story.author === userId) {
      return next(); // We're the author; proceed.
    }

    // We're not the author, but we can edit the story if we're an admin
    User.findOneById(userId).exec(function (err, user) {
      // Unexpected error occurred-- skip to the app's default error (500) handler
      if (err) {
        return next(err);
      }

      // This really shouldn't happen, but just in case...
      if (!user) {
        return res.redirect('/login');
      }

      if (user.isAdmin !== true) {
        return res.forbidden('You are not permitted to perform this action.');
      }

      // If we made it all the way down here, looks like everything's ok, so we'll let the user through
      next();
    });
  });
};
