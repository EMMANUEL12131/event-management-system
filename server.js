// Load environment variables from .env into process.env
require("dotenv").config();

// Import the Express library
const express = require("express");

// Import our database connection function
const connectDB = require("./config/db");

// Import our auth routes
const authRoutes = require("./routes/authRoutes");

// Create our server
const app = express();

// Use the PORT from .env, or fall back to 3000 if missing
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// This is essential middleware: it tells Express to automatically read
// incoming JSON data from requests and make it available as req.body
app.use(express.json());

// Mount our auth routes under the "/api/auth" path
// So "/register" inside authRoutes becomes "/api/auth/register" here
app.use("/api/auth", authRoutes);

// Our homepage route, unchanged
app.get("/", (req, res) => {
  res.send("Hello! My Event Management System server is running.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});