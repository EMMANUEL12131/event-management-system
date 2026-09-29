// Import mongoose, since we need it to define our data structure
const mongoose = require("mongoose");

// A "Schema" is like a form template — it defines what fields a User has,
// and what rules those fields must follow
const userSchema = new mongoose.Schema({
  // Every user needs a name — this field is required, and must be text
  name: {
    type: String,
    required: true,
  },

  // Email must be provided, must be text, and must be unique
  // (no two users can register with the same email)
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // Password must be provided, stored as text
  // (we will NEVER store the real password — only an encrypted version, coming soon)
  password: {
    type: String,
    required: true,
  },

  // This field marks whether a user is a regular attendee or an event organizer/admin
  // We give it a default value of "attendee" so we don't have to set it manually every time
  role: {
    type: String,
    enum: ["attendee", "organizer", "admin"], // only these 3 values are allowed
    default: "attendee",
  },
}, {
  // This automatically adds "createdAt" and "updatedAt" timestamps to every user
  timestamps: true,
});

// Turn our schema into an actual "Model" — a tool we'll use to create,
// read, update, and delete users in the database
const User = mongoose.model("User", userSchema);

// Make this model available to other files (controllers, routes, etc.)
module.exports = User;