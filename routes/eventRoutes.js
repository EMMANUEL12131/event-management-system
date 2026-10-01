const express = require("express");
const router = express.Router();

const { createEvent, getEvents, registerForEvent, getMyEvents, getMyRegistrations } = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

// Specific routes first, before the wildcard ":id" route
router.get("/my-events", protect, getMyEvents);
router.get("/my-registrations", protect, getMyRegistrations);

// GET /api/events → fetch all events (public)
router.get("/", getEvents);

// POST /api/events → create a new event (protected)
router.post("/", protect, createEvent);

// POST /api/events/:id/register → register for a specific event (protected)
router.post("/:id/register", protect, registerForEvent);

module.exports = router;