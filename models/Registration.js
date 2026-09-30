// Import mongoose
const mongoose = require("mongoose");

// A Registration links one User to one Event
const registrationSchema = new mongoose.Schema({
  // Which user registered
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Which event they registered for
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
}, {
  // Track when each registration happened
  timestamps: true,
});

// This is important: it tells MongoDB "the combination of user + event
// must be unique" — meaning the same user can NEVER register for the
// same event twice. This directly solves Challenge #1 from your brief
// ("Prevent duplicate registrations") at the database level, not just in our code
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;