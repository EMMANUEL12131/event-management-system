// Import the Express library we just installed, so we can use its features
const express = require("express");

// Create an "app" — this represents our whole web server
const app = express();

// Choose a port number — this is like a "door" on your phone that the server listens on
const PORT = 3000;

// Define what happens when someone visits the homepage ("/") of our server
// req = the incoming request, res = the response we send back
app.get("/", (req, res) => {
  res.send("Hello! My Event Management System server is running.");
});

// Start the server and make it listen for visitors on our chosen port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});