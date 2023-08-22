const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// Get login page /login
router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
// Post login page /login authentification

router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);

// Post logout page /logout
router.post("/logout", authController.postLogout);

// Get reset password /reset
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

module.exports = router;
