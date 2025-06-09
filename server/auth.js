import express from "express";
import cors from 'cors'

const app = express();
const port = 4000;
app.use(express.json());
app.use(
    cors({
        origin: '*'
    })
)

let currentUser = {} // empty object to store the current user, attempting to login using credentials

async function getCurrentUser(email, username, res) {
  try {
    const [records] = await con
      .promise()
      .query("SELECT * FROM users WHERE email = ? OR username = ?", [
        email,
        username,
      ]);
    if (records.length > 0) {
      currentUser = records[0]; //gets the retrieved user using username or email
      return currentUser;
    } else return res.status(400).json({ message: "User doesn't exist. Create an account"});
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

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
