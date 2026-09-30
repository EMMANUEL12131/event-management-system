// Import Express so we can use its Router feature
const express = require("express");

// A Router lets us group related routes together in their own file
const router = express.Router();

// Import both controller functions now
const { registerUser, loginUser } = require("../controllers/authController");

// When a POST request hits "/register", run registerUser
router.post("/register", registerUser);

// When a POST request hits "/login", run loginUser
router.post("/login", loginUser);

// Make this router available to server.js
module.exports = router;