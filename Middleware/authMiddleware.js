// Import jsonwebtoken to verify tokens
const jwt = require("jsonwebtoken");

// Import our User model, so we can look up the user the token belongs to
const User = require("../models/User");

// "Middleware" is a function that runs BEFORE the actual route handler,
// usually to check something (like login status) before allowing access
const protect = async (req, res, next) => {
  // Tokens are normally sent in a header called "Authorization",
  // formatted like: "Bearer eyJhbGciOi..."
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Split "Bearer eyJhbGciOi..." into two parts, and grab just the token itself
      token = req.headers.authorization.split(" ")[1];

      // Verify the token is valid and wasn't tampered with, using our secret key
      // If valid, this gives us back the data we originally stored in it (the user's id)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Look up the actual user in the database using that id,
      // and attach it to req.user — so any route after this can access req.user
      // ".select('-password')" means "give me everything except the password field"
      req.user = await User.findById(decoded.id).select("-password");

      // Everything checked out — call next() to let the actual route continue
      next();
    } catch (error) {
      // If verification fails (expired, tampered, invalid), block access
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If there was no token at all in the header, block access immediately
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Make this available to any route that needs to protect itself
module.exports = { protect };