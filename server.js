// Load environment variables from .env into process.env
require("dotenv").config();

// Import the Express library
const express = require("express");

// Import our database connection function
const connectDB = require("./config/db");

// Import our route files
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

// Create our server
const app = express();

// Use the PORT from .env, or fall back to 3000 if missing
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON
app.use(express.json());
// Serve any file inside the "public" folder directly to browsers
// e.g. a file at public/index.html becomes accessible at http://localhost:3000/index.html
app.use(express.static("public"));
// Mount our routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Our homepage route
app.get("/", (req, res) => {
  res.send("Hello! My Event Management System server is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});