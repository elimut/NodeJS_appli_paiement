const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

// Get login page /login
router.get("/login", authController.getLogin);
// Post login page /login authentification
router.post("/login", authController.postLogin);
// Post logout page /logout
router.post("/logout", authController.postLogout);

module.exports = router;
