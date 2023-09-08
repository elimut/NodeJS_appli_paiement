module.exports = (req, res, next) => {
  if (!req.session.user.id === 1) {
    return res.redirect("/");
  }
  next();
};
