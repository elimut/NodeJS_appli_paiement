exports.get404Page = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404", // user need to beauth to access
    isAuthenticated: req.loggedIn,
  });
};
