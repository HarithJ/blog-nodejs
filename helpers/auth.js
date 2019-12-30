module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  let error = new Error('Not Authorised');
  error.status = 403;
  next(error);
}
