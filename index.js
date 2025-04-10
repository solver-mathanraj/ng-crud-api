const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB Atlas URI
const MONGO_URI =
  "mongodb+srv://Kandhan:Valli@ngcrudfull.srgljky.mongodb.net/my_data?retryWrites=true&w=majority";
<<<<<<< HEAD
=======

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
>>>>>>> a2056c8f27963fd7f1f6e6b04a9c1d0ad37a3ed7

// Middleware
app.use(
  cors({
    origin: ["https://ng-crud-full.vercel.app", "http://localhost:4200"],
  })
);
app.use(express.json());

// Define User schema with `id`
const userSchema = new mongoose.Schema({
<<<<<<< HEAD
  id: String,
=======
  id:String,
>>>>>>> a2056c8f27963fd7f1f6e6b04a9c1d0ad37a3ed7
  username: String,
  name: String,
  number: String, // stored as string to handle large numbers safely
  email: String,
});

const User = mongoose.model("User", userSchema, "users"); // specify "users" collection

// API Routes

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// GET single user by id
app.get("/users/:id", async (req, res) => {
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
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    user ? res.json(user) : res.status(404).send("User not found");
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await User.findOneAndDelete({ id: req.params.id });
    result ? res.status(204).send() : res.status(404).send("User not found");
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
