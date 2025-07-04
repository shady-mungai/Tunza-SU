import express from "express";
import cors from "cors";
import con from "./dbConnection.js";
import bcrypt from "bcrypt";
import axios from "axios";
import speakeasy from "speakeasy";

const app = express();
const port = 4000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let currentUser = {}; // empty object to store the current user, attempting to login using credentials

async function getCurrentUser(email, admission_number, res) {
  try {
    const [records] = await con
      .promise()
      .query("SELECT * FROM users2 WHERE email = ? OR admission_number = ?", [
        email,
        admission_number,
      ]);
    if (records.length > 0) {
      currentUser = records[0]; //gets the retrieved user using admission_number or email
      return currentUser;
    } else
      return res
        .status(400)
        .json({ message: "User doesn't exist. Create an account" });
  } catch (err) {
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Database access denied. Check your credentials.");
    } else if (err.code === "ER_BAD_DB_ERROR") {
      console.error("Database does not exist. Check your DB name.");
    } else if (err.code === "ER_PARSE_ERROR") {
      console.error("SQL syntax error:", err.message);
    } else if (err.code === "ECONNREFUSED") {
      console.error("Database connection refused. Is MySQL running?");
    } else if (err.code === "ETIMEDOUT") {
      console.error("Database connection timed out.");
    } else {
      console.error("Unexpected error:", err.message);
    }
  }
}
// generate a secret key for each user and generate an OTP
function generateSecret() {
  return speakeasy.generateSecret({ length: 20 });
}

app.post("/register", async (req, res) => {
  const { name, email, admission_number, password, phone_number, role } =
    req.body;

  await getCurrentUser(email, admission_number);

  if (!currentUser == undefined || !currentUser == null) {
    return res.status(400).json({ message: "User already exists, Login" });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const secret = generateSecret();

  console.log([
    name,
    email,
    admission_number,
    hashedPassword,
    secret.base32,
    phone_number,
    role,
  ]);
  // Insert user into DBerr.message
  try {
    const [records] = await con
      .promise()
      .query(
        "INSERT INTO users2 (name, email, admission_number, password, totp_secret, phone_number, role) VALUES (?, ?, ?, ?, ?,?,?)",
        [
          name,
          email,
          admission_number,
          hashedPassword,
          secret.base32,
          phone_number,
          role,
        ]
      );
    console.log("---------------------------------------");

    console.log(records);

    console.log("---------------------------------------");
    if (records.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Registration successful",
        user: currentUser, // This is what your frontend expects
      });
    }
  } catch (err) {
    // log out the error codes and the error message
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Database access denied. Check your credentials.");
    } else if (err.code === "ER_BAD_DB_ERROR") {
      console.error("Database does not exist. Check your DB name.");
    } else if (err.code === "ER_PARSE_ERROR") {
      console.error("SQL syntax error:", err.message);
    } else if (err.code === "ECONNREFUSED") {
      console.error("Database connection refused. Is MySQL running?");
    } else if (err.code === "ETIMEDOUT") {
      console.error("Database connection timed out.");
    } else {
      console.error("Unexpected error:", err.message);
    }
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${err.message}` });
  }
});

// to login to the application
app.post("/login", async (req, res) => {
  const { email, admission_number, password } = req.body;

  console.log("--------------------------------");
  console.log(req.body);
  console.log("--------------------------------");

  await getCurrentUser(email, admission_number, res);

  const hashedPassword = currentUser.password;
  const isValid = await bcrypt.compare(password, hashedPassword);
  if (isValid) {
    console.log("Password matches !"); // return errors to display to end user
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: currentUser, // This is what your frontend expects
    });
  } else {
    res
      .status(400)
      .json({
        message:
          "Email, admission number and password confirmation do not match",
      });
  }
});

app.post("/addReport", async (req, res) => {
  const {
    user_id,
    title,
    description,
    location,
    category,
    priority,
    status = "Pending", // default status
    image_url,
    assigned_to = null,
    estimated_cost = null,
    actual_cost = null,
    estimated_completion_date = null,
    actual_completion_date = null,
    completed_at = null,
  } = req.body;

  try {
    const [result] = await con.promise().query(
      `INSERT INTO reports2 
        (user_id, title, description, location, category, priority, status, image_url, assigned_to, estimated_cost, actual_cost, estimated_completion_date, actual_completion_date, created_at, updated_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
      [
        user_id,
        title,
        description,
        location,
        category,
        priority,
        status,
        image_url,
        assigned_to,
        estimated_cost,
        actual_cost,
        estimated_completion_date,
        actual_completion_date,
        completed_at,
      ]
    );
    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: "Report added successfully" });
    } else {
      res.status(400).json({ success: false, message: "Failed to add report" });
    }
  } catch (err) {
    console.error("Error adding report:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
