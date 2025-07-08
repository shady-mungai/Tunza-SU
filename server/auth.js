import express from "express";
import cors from "cors";
import con from "./dbConnection.js";
import bcrypt from "bcrypt";
import axios from "axios";
import speakeasy from "speakeasy";
import multer from "multer";
import path from "path";

const app = express();
const port = 4000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

let currentUser = {}; // empty object to store the current user, attempting to login using credentials

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Serve uploads directory statically
app.use("/uploads", express.static("uploads"));

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
    } else {
      currentUser = {}; // Reset currentUser to empty object
      // Only return error response if res parameter is provided (for login)
      if (res) {
        return res
          .status(400)
          .json({ message: "User doesn't exist. Create an account" });
      }
      return null; // For registration checks, just return null
    }
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
    // Only return error response if res parameter is provided
    if (res) {
      return res.status(500).json({ message: "Database error occurred" });
    }
    return null;
  }
}
// generate a secret key for each user and generate an OTP
function generateSecret() {
  return speakeasy.generateSecret({ length: 20 });
}

app.post("/register", async (req, res) => {
  const { name, email, admission_number, password, phone_number, role } =
    req.body;

  // Check if user already exists
  await getCurrentUser(email, admission_number);

  // If user exists, return error
  if (currentUser && Object.keys(currentUser).length > 0) {
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

  // Insert user into DB
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
      // Fetch the newly created user to get complete data including ID
      const [newUserRecords] = await con
        .promise()
        .query("SELECT * FROM users2 WHERE email = ? OR admission_number = ?", [
          email,
          admission_number,
        ]);

      if (newUserRecords.length > 0) {
        const newUser = newUserRecords[0];
        return res.status(200).json({
          success: true,
          message: "Registration successful",
          user: newUser, // Return the complete user data
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "User created but could not retrieve user data",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
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
    res.status(400).json({
      message: "Email, admission number and password confirmation do not match",
    });
  }
});

app.post("/addReport", upload.single("image"), async (req, res) => {
  const {
    user_id,
    title,
    description,
    location,
    category,
    priority,
    status = "in_progress",
    assigned_to = 31,
    estimated_cost = null,
    actual_cost = null,
    estimated_completion_date = null,
    actual_completion_date = null,
    completed_at = null,
  } = req.body;

  // The uploaded file info is in req.file
  const image_url = req.file ? req.file.path : null;
  console.log("image_url being saved:", image_url);

  // Validation: check required fields
  if (
    !user_id ||
    !title ||
    !description ||
    !location ||
    !category ||
    !priority
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

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
      res
        .status(200)
        .json({ success: true, message: "Report added successfully" });
    } else {
      res.status(400).json({ success: false, message: "Failed to add report" });
    }
  } catch (err) {
    console.error("Error adding report:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/userReports", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "user_id is required" });
  }

  try {
    const [reports] = await con
      .promise()
      .query(
        `SELECT * FROM reports2 WHERE user_id = ? ORDER BY created_at DESC`,
        [user_id]
      );

    res.status(200).json({
      success: true,
      reports: reports,
    });
  } catch (err) {
    console.error("Error fetching user reports:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/assignedReports", async (req, res) => {
  const { maintenance_id } = req.query;

  if (!maintenance_id) {
    return res
      .status(400)
      .json({ success: false, message: "maintenance_id is required" });
  }

  try {
    const [reports] = await con.promise().query(
      `SELECT r.*, u.name as reporter_name, u.email as reporter_email 
       FROM reports2 r 
       LEFT JOIN users2 u ON r.user_id = u.id 
       WHERE r.assigned_to = ? 
       ORDER BY r.created_at DESC`,
      [maintenance_id]
    );

    res.status(200).json({
      success: true,
      reports: reports,
    });
  } catch (err) {
    console.error("Error fetching assigned reports:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Google OAuth endpoint
app.post("/auth/google", async (req, res) => {
  const { email, name } = req.body;
  console.log(`Email address is ${email}`);
  console.log("-----------------------------------------");
  console.log(`Name from google ${name}`);

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required from Google user info." });
  }
  try {
    // Check if user exists
    const [records] = await con
      .promise()
      .query("SELECT * FROM users2 WHERE email = ?", [email]);
    let user;
    if (records.length > 0) {
      user = records[0];
    } else {
      // Create a new user with Google info
      const admission_number = "GGL-" + Math.floor(Math.random() * 1000000); // random fallback
      const role = "student";
      const password = 123;
      const phone_number = "0712345678";
      const totp_secret = null;
      const [result] = await con
        .promise()
        .query(
          "INSERT INTO users2 (name, email, admission_number, password, totp_secret, phone_number, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            email,
            admission_number,
            password,
            totp_secret,
            phone_number,
            role,
          ]
        );
      // Fetch the newly created user
      const [newUserRecords] = await con
        .promise()
        .query("SELECT * FROM users2 WHERE email = ?", [email]);
      user = newUserRecords[0];
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users
app.get("/allUsers", async (req, res) => {
  try {
    const [users] = await con.promise().query("SELECT * FROM users2");
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete a user by ID
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await con
      .promise()
      .query("DELETE FROM users2 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete a report by ID
app.delete("/report/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await con
      .promise()
      .query("DELETE FROM reports2 WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "Report deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Report not found" });
    }
  } catch (err) {
    console.error("Error deleting report:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update report status
app.put("/reports/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });
  }
  try {
    const [result] = await con
      .promise()
      .query(
        "UPDATE reports2 SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, id]
      );
    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ success: true, message: "Status updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Report not found" });
    }
  } catch (err) {
    console.error("Error updating report status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get report statistics for dashboard
app.get("/reportStats", async (req, res) => {
  try {
    // Count active reports (status = 'in_progress' or 'active')
    const [active] = await con
      .promise()
      .query(
        "SELECT COUNT(*) as count FROM reports2 WHERE status IN ('in_progress', 'active', 'Pending Review')"
      );
    // Count resolved reports (status = 'resolved' or 'completed')
    const [resolved] = await con
      .promise()
      .query(
        "SELECT COUNT(*) as count FROM reports2 WHERE status IN ('resolved', 'completed', 'Resolved')"
      );
    // Count pending reports (status = 'pending', 'Pending', or 'Pending Review')
    const [pending] = await con
      .promise()
      .query(
        "SELECT COUNT(*) as count FROM reports2 WHERE status IN ('pending', 'Pending', 'Pending Review')"
      );
    res.status(200).json({
      activeReports: active[0].count,
      resolvedReports: resolved[0].count,
      pendingReports: pending[0].count,
    });
  } catch (err) {
    console.error("Error fetching report stats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all active reports for admin panel
app.get("/activeReports", async (req, res) => {
  try {
    const [reports] = await con
      .promise()
      .query(
        `SELECT r.*, u.name as submittedBy FROM reports2 r LEFT JOIN users2 u ON r.user_id = u.id WHERE r.status IN ('in_progress', 'active', 'Pending Review') ORDER BY r.created_at DESC`
      );
    res.status(200).json({ success: true, reports });
  } catch (err) {
    console.error("Error fetching active reports:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
