// Import Express so we can use its Router feature
const express = require("express");
const router = express.Router();

// Import our event controller functions
const { createEvent, getEvents } = require("../controllers/eventController");

// Import our "protect" middleware, to guard routes that need login
const { protect } = require("../middleware/authMiddleware");

// GET /api/events → fetch all events (public — anyone can browse, no login needed)
router.get("/", getEvents);

// POST /api/events → create a new event (protected — only logged-in users)
// Notice "protect" is listed BEFORE "createEvent" — Express runs middleware
// in order, so protect checks the token first, and only calls createEvent
// if that check passes
router.post("/", protect, createEvent);

// Make this router available to server.js
module.exports = router;