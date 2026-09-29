// Load environment variables from .env into process.env
require("dotenv").config();

// Import the Express library
const express = require("express");

// Import our new database connection function
const connectDB = require("./config/db");

// Create our server
const app = express();

// Use the PORT from .env, or fall back to 3000 if it's missing
const PORT = process.env.PORT || 3000;

// Actually connect to MongoDB before we do anything else
connectDB();

// Our homepage route, same as before
app.get("/", (req, res) => {
  res.send("Hello! My Event Management System server is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});