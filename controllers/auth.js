// Get page login /login
exports.getLogin = (req, res) => {
  // console.log(req.get("Cookie").split("=")[1]);
  //loggedIn=true
  //split to fetch after =. Extract header of cookie, value oh cookie
  // const isLoggedIn = req.get("Cookie").split("=")[1];
  res.render("auth/login", {
    pageTitle: "Se connecter",
    path: "/login",
    // user need to beauth to access
    // isAuthenticated: req.isLoggedIn,
    // isAuthenticated: isLoggedIn,
    isAuthenticated: false,
  });
};

// Post page login /login authentification
exports.postLogin = (req, res) => {
  // define cookie to store auth information (set-cookie nom réservé) values cookie = paie key value
  res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
  // if user login => redirect
  res.redirect("/");
};
