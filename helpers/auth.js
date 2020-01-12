const auth = {

  authOnly: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    let error = new Error('Not Authorised');
    error.status = 403;
    next(error);
  },

  userAuth: (req, res, next) => {
    if (req.isAuthenticated() && req.user.username === req.params.username) {
      return next();
    }

    let error = new Error('Not Authorised');
    error.status = 403;
    next(error);
  },

}

module.exports = auth
