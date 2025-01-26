const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const client = require("./connectionDB");
const Users = require("./models/models");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000;

const newUser = new Users("FooBar", "test@gmail.com", "123");

console.log(newUser);
// Root route
app.get("/", (req, res) => {
  res.send("Hello from Node.js Backend!");
});

// Route to retrieve all users from DB
app.get("/users", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving users:", err.stack);
    res.status(500).json({ error: "Unable to retrieve users from database" });
  }
});

// Route to add a new user into DB
app.post("/users", async (req, res) => {
  const { id, firstName, lastName, email, password } = req.body;

  // Validate input
  if (!id || !firstName || !lastName || !email || !password) {
    return res.status(400).json({
      error:
        "All fields (id, firstName, lastName, email, password) are required",
    });
  }

  try {
    // Check if the email already exists in the database
    const checkEmailQuery = "SELECT * FROM users WHERE email = $1";
    const checkEmailResult = await client.query(checkEmailQuery, [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Insert the new user into the users table
    const query = `
      INSERT INTO users (id, first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [id, firstName, lastName, email, password];
    const result = await client.query(query, values);

    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error adding user:", err.stack);
    res.status(500).json({ error: "Unable to add user to database" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
