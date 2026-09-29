// Import Express so we can use its Router feature
const express = require("express");

// A Router lets us group related routes together in their own file,
// instead of cramming everything into server.js
const router = express.Router();

// Import the registerUser function we just wrote
const { registerUser } = require("../controllers/authController");

// Define the route: when a POST request hits "/register",
// run the registerUser function to handle it
router.post("/register", registerUser);

// Make this router available to server.js
module.exports = router;