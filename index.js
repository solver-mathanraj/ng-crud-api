const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 8080;
const DATA_FILE = "db.json";

app.use(cors());
app.use(bodyParser.json());

// Utility: Read data
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// Utility: Write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all users
app.get("/users", (req, res) => {
  const users = readData();
  res.json(users);
});

// GET single user
app.get("/users/:id", (req, res) => {
  const users = readData();
  const user = users.find((u) => u.id === req.params.id);
  user ? res.json(user) : res.status(404).send("User not found");
});

// POST new user
app.post("/users", (req, res) => {
  const users = readData();
  const newUser = { id: uuidv4(), ...req.body };
  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// PATCH update user
app.patch("/users/:id", (req, res) => {
  let users = readData();
  const index = users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).send("User not found");

  users[index] = { ...users[index], ...req.body };
  writeData(users);
  res.json(users[index]);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  let users = readData();
  const updatedUsers = users.filter((u) => u.id !== req.params.id);
  if (users.length === updatedUsers.length)
    return res.status(404).send("User not found");

  writeData(updatedUsers);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
