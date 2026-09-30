// Import Express so we can use its Router feature
const express = require("express");
const router = express.Router();

// Import our event controller functions
const { createEvent, getEvents, registerForEvent } = require("../controllers/eventController");

// Import our "protect" middleware
const { protect } = require("../middleware/authMiddleware");

// GET /api/events → fetch all events (public)
router.get("/", getEvents);

// POST /api/events → create a new event (protected)
router.post("/", protect, createEvent);

// POST /api/events/:id/register → register for a specific event (protected)
// ":id" is a "route parameter" — a placeholder that matches any event ID
// e.g. POST /api/events/6abd6c9b7dab202972c54bac/register
router.post("/:id/register", protect, registerForEvent);

// Make this router available to server.js
module.exports = router;