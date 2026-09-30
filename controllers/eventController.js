// Import our Event model, so we can create and read events in the database
const Event = require("../models/Event");

// This function handles creating a new event
// It assumes our "protect" middleware already ran, so req.user is available
const createEvent = async (req, res) => {
  try {
    // Pull out all the event details the user sent in the request body
    const { title, description, category, date, time, location, capacity } = req.body;

    // Create the event in the database
    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      organizer: req.user.id, // comes from our auth middleware — the logged-in user's id
    });

    // Send back the newly created event with a 201 "Created" status
    res.status(201).json(event);

  } catch (error) {
    // If anything goes wrong (missing fields, bad data, etc.), send an error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// This function fetches ALL events, so users can browse them
const getEvents = async (req, res) => {
  try {
    // Find every event in the database
    // ".populate('organizer', 'name email')" replaces the organizer's ID
    // with their actual name and email, pulled from the User collection
    const events = await Event.find().populate("organizer", "name email");

    // Send back the full list
    res.status(200).json(events);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Make both functions available to our routes file
module.exports = { createEvent, getEvents };