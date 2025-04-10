const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB Atlas URI
const MONGO_URI =
  "mongodb+srv://Kandhan:Valli@ngcrudfull.srgljky.mongodb.net/my_data?retryWrites=true&w=majority";

// Middleware
app.use(
  cors({
    origin: ["https://ng-crud-full.vercel.app", "http://localhost:4200"],
  })
);
app.use(express.json());

// Define User schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: String,
  name: String,
  number: String, // Storing as string is good for mobile numbers
  email: String,
});

// Create User model
const User = mongoose.model("User", userSchema, "users");

// Routes

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// GET single user by ID
app.get("/users/:_id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    user ? res.json(user) : res.status(404).send("User not found");
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
});

// POST new user
app.post("/users", async (req, res) => {
  try {
    const newUser = new User({ id: uuidv4(), ...req.body });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
});

// PATCH update user
app.patch("/users/:_id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    updatedUser
      ? res.json(updatedUser)
      : res.status(404).send("User not found");
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
});

// DELETE user
app.delete("/users/:_id", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });
    deletedUser
      ? res.status(204).send()
      : res.status(404).send("User not found");
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
