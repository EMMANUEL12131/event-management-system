// Import bcryptjs, to encrypt passwords before saving them
const bcrypt = require("bcryptjs");

// Import jsonwebtoken, to create login tokens
const jwt = require("jsonwebtoken");

// Import our User model, so we can create and find users in the database
const User = require("../models/User");

// This function handles new user registration
// It's "async" because talking to the database takes time, and we need to wait for it
const registerUser = async (req, res) => {
  try {
    // Pull the name, email, and password out of the incoming request's body
    // (this is the data the user typed into a registration form)
    const { name, email, password } = req.body;

    // Check if a user with this email already exists in the database
    const existingUser = await User.findOne({ email });

    // If they do, stop here and send back an error — no duplicate accounts allowed
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Generate a "salt" — random data that makes each password hash unique,
    // even if two users happen to pick the same password
    const salt = await bcrypt.genSalt(10);

    // Actually hash (scramble) the password using that salt
    // From here on, we only ever store this scrambled version — never the real password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user in the database, using our User model
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // store the hashed version, not the original
    });

    // Create a JWT token for this new user, so they're immediately "logged in"
    // after registering, without needing a separate login step
    const token = jwt.sign(
      { id: user._id }, // data we're storing inside the token (just their unique ID)
      process.env.JWT_SECRET, // the secret key from our .env file, used to sign it securely
      { expiresIn: "30d" } // this token will stay valid for 30 days
    );

    // Send back a success response with the user's basic info and their token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    // If anything above goes wrong, send back a generic server error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// This function handles logging in an existing user
const loginUser = async (req, res) => {
  try {
    // Pull email and password from the incoming request
    const { email, password } = req.body;

    // Look for a user with this email in the database
    const user = await User.findOne({ email });

    // If no user was found with that email, stop and send an error
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the typed password against the stored hashed password
    // bcrypt.compare handles the scrambling internally — we never un-hash anything
    const isMatch = await bcrypt.compare(password, user.password);

    // If it doesn't match, send the same generic error
    // (we deliberately don't say "wrong password" specifically — that would
    // tell an attacker the email exists, which is a small security leak)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If we reach here, the password is correct — generate a fresh token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Send back the user's info and their new token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Make this function available to other files (our routes file, next)
module.exports = { registerUser, loginUser };