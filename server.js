// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Initialize Express
const app = express();

// Set up middlewares
app.use(cors()); // Enable Cross-Origin Requests (CORS)
app.use(bodyParser.json()); // Parse incoming JSON request bodies

// Set the port for the backend server
const PORT = process.env.PORT || 5000;

// Sample route to test the server
app.get("/", (req, res) => {
  res.send("Hello from Node.js Backend!");
});

// Route to retrieve users from the JSON file
app.get("/users", (req, res) => {
  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, "Users.json"), "utf-8")
  );
  res.json(users);
});

// Route to add a new user
app.post("/users", (req, res) => {
  const { id, firstName, lastName, email, password } = req.body;
  const newUser = { id, firstName, lastName, email, password };

  // Load existing users from the JSON file
  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, "users.json"), "utf-8")
  );

  // Add the new user to the array
  users.push(newUser);

  // Save the updated users back to the JSON file
  fs.writeFileSync(
    path.join(__dirname, "users.json"),
    JSON.stringify(users, null, 2)
  );

  res.status(201).json(newUser);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
