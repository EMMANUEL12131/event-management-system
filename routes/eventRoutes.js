const express = require("express");
const router = express.Router();

const { createEvent, getEvents, registerForEvent, getMyEvents } = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/events/my-events → MUST come before any route with a ":id" pattern,
// otherwise Express would mistake "my-events" for an actual event ID
router.get("/my-events", protect, getMyEvents);

// GET /api/events → fetch all events (public)
router.get("/", getEvents);

// POST /api/events → create a new event (protected)
router.post("/", protect, createEvent);

// POST /api/events/:id/register → register for a specific event (protected)
router.post("/:id/register", protect, registerForEvent);

module.exports = router;