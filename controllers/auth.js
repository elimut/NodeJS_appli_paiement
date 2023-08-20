const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const sendgridTransport = require("nodemailer-sendgrid-transport");

//  Initialize way to send email. Send a configuration will be use by nodemailer
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

// Get page login /login
exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Se connecter",
    path: "/login",
    // user need to be auth to access
    isAuthenticated: false,
    // fetch message of flash in req
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User.findOne({ where: { email: email } })
    .then((userInfo) => {
      if (userInfo) {
        req.flash("error", `L'email est déjà utilisé`);
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "shop@node.fr",
            subject: "Bienvenue!",
            html: "<h1>Bienvenue</h1>",
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};

// Post page login /login authentification
exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        // error message with flash, arg: key error and message
        req.flash("error", "Email ou mot de passe invalide");
        return res.redirect("login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            // if redirect to fast and sure to save session in db
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Email ou mot de passe invalide");
          res.redirect("login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("login");
        });
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
      res.redirect("/");
    }
  });
};
