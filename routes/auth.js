const express = require("express");
const router = express.Router();
//  Import sous package of express-validator to validate input's data
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");

// Get login page /login
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
// Post login page /login authentification

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage(`L'email saisi n'est pas valide`)
      .normalizeEmail(),
    body(
      "password",
      "Le mot de passe doit contenir au moins 5 caratères, et ne contenir que des chiffres et des lettres."
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
// Path , middleware
router.post(
  "/signup",
  //   array optionnal but better for read code
  [
    check("email")
      .isEmail()
      .withMessage(`L'email saisi n'est pas valide`)
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userInfo) => {
          if (userInfo) {
            return Promise.reject(`L'email est déjà utilisé, 
            veuillez vous connecter ou en saisir un autre.
            `);
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Le mot de passe doit contenir au moins 5 caratères, et ne contenir que des chiffres et des lettres."
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        return true;
      }),
  ],
  authController.postSignup
);

// Post logout page /logout
router.post("/logout", authController.postLogout);

// Get reset password /reset
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

module.exports = router;
