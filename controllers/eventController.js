// Import our Event model, so we can create and read events in the database
const Event = require("../models/Event");
// Import our Registration model, to record who signed up for what
const Registration = require("../models/Registration");
// Import our email-sending function
const sendConfirmationEmail = require("../config/email");
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
// This function handles a logged-in user registering for a specific event
const registerForEvent = async (req, res) => {
  try {
    // The event's ID comes from the URL (e.g. /api/events/:id/register)
    const eventId = req.params.id;

    // Find the event they're trying to register for
    const event = await Event.findById(eventId);

    // If no event exists with that ID, stop here
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the event is already full
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: "This event is full" });
    }

    // Try to create the registration record
    // If this user already registered for this event, our unique index
    // in the Registration model will cause this to throw an error
    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
    });

    // If we reach here, registration succeeded — increase the event's count
    event.registeredCount += 1;
    await event.save();

    // Send a confirmation email to the user who just registered
    // req.user.email comes from our auth middleware (the logged-in user)
    await sendConfirmationEmail(req.user.email, event.title, event.date.toDateString());

    // Send back confirmation
    res.status(201).json({
      message: "Successfully registered for event",
      registration,
    });

  } catch (error) {
    // MongoDB gives error code 11000 specifically for "duplicate key" violations —
    // this is how our unique index (user + event) shows up as an error here
    if (error.code === 11000) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Make both functions available to our routes file
module.exports = { createEvent, getEvents, registerForEvent };