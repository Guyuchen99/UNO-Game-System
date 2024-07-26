const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

// Route for handling user login
router.post("/login", authController.login);

// Route for handling user logout
router.get("/logout", authController.logout);

module.exports = router;
