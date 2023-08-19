const User = require("../models/user");

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
  // res.setHeader("Set-Cookie", "loggedIn=true; Expires=");
  User.findByPk(1)
    // store user in a request
    .then((user) => {
      // user object JS in db and sequelize's objetc to, with methods...
      // use session middleware
      req.session.isLoggedIn = true;
      // req.session.user = user;
      res.redirect("/");
    })
    // to continue if had an user
    .catch((err) => console.log(err));
};

// Post page logout /logout deconnection
exports.postLogout = (req, res) => {
  // method of session's package on session object
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      // req.end();
      // passed fonction call when session destroyed
      res.redirect("/");
    }
  });
};
