const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB Atlas URI
const MONGO_URI =
  "mongodb+srv://Kandhan:Valli@ngcrudfull.srgljky.mongodb.net/my_data?retryWrites=true&w=majorit";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors({ origin: "https://ng-crud-full.vercel.app" }));
app.use(express.json());

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  number: String, // stored as string to handle large numbers safely
  email: String,
});

const User = mongoose.model("User", userSchema, "users"); // specify "users" collection

// API Routes

// GET all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET single user by id
app.get("/users/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  user ? res.json(user) : res.status(404).send("User not found");
});

// POST new user
app.post("/users", async (req, res) => {
  const newUser = new User({ id: uuidv4(), ...req.body });
  await newUser.save();
  res.status(201).json(newUser);
});

// PATCH update user
app.patch("/users/:id", async (req, res) => {
  const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
  });
  user ? res.json(user) : res.status(404).send("User not found");
});

// DELETE user
app.delete("/users/:id", async (req, res) => {
  const result = await User.findOneAndDelete({ id: req.params.id });
  result ? res.status(204).send() : res.status(404).send("User not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at mongoDB at ${PORT}`);
});
