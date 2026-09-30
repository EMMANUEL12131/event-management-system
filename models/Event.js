// Import mongoose, since we need it to define our data structure
const mongoose = require("mongoose");

// Define the shape of an Event document
const eventSchema = new mongoose.Schema({
  // The event's name — required
  title: {
    type: String,
    required: true,
  },

  // A longer description of the event — required
  description: {
    type: String,
    required: true,
  },

  // What category the event falls under (Technology, Music, Business, etc.)
  category: {
    type: String,
    required: true,
  },

  // The date the event happens
  date: {
    type: Date,
    required: true,
  },

  // The time of day the event starts (stored as plain text, e.g. "18:00")
  time: {
    type: String,
    required: true,
  },

  // Where the event takes place
  location: {
    type: String,
    required: true,
  },

  // Maximum number of people who can attend
  capacity: {
    type: Number,
    required: true,
  },

  // How many people have registered so far — starts at 0 automatically
  registeredCount: {
    type: Number,
    default: 0,
  },

  // A reference linking this event to the User who created it
  // "ObjectId" is MongoDB's way of storing a unique ID that points to another document
  // "ref: User" tells mongoose this ID refers to a document in the User collection
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  // Automatically track when each event was created/updated
  timestamps: true,
});

// Turn the schema into a usable Model
const Event = mongoose.model("Event", eventSchema);

// Make it available to other files
module.exports = Event;