// Middleware used in routes to verify if user is authenticated
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
};
