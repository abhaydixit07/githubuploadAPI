import express from "express";
import bcrypt from "bcryptjs"; // Assuming use of bcryptjs for password hashing
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const authRouter = express.Router();

// Sign Up
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ error: "Server error" }); // Generic error message for security
  }
});

// Sign In
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ error: "Server error" }); // Generic error message for security
  }
});

// Check token validity
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ error: "Server error" }); // Generic error message for security
  }
});

// Get user data (protected route)
authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
  } catch (error) {
    console.error(error.message); // Log the error for debugging
    res.status(500).json({ error: "Server error" }); // Generic error message for security
  }
});

export default authRouter;
