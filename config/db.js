// Import mongoose, the library that lets us talk to MongoDB using JavaScript
const mongoose = require("mongoose");

// This is a function we'll call once, when our server starts,
// to open a connection to our MongoDB Atlas database
const connectDB = async () => {
  try {
    // mongoose.connect() reads the connection string and attempts to connect
    // "await" pauses this function until the connection succeeds (or fails)
    await mongoose.connect(process.env.MONGO_URI);

    // If we reach this line, the connection worked
    console.log("MongoDB connected successfully");
  } catch (error) {
    // If something goes wrong (wrong password, no internet, etc.), this runs instead
    console.error("MongoDB connection failed:", error.message);

    // Stop the whole app if the database can't connect — no point running without it
    process.exit(1);
  }
};

// Make this function available to other files (like server.js) that need it
module.exports = connectDB;