import "dotenv/config";
import bcrypt from "bcryptjs";

import { loadConfig } from "../src/config.js";
import { createDatabase } from "../src/database.js";

const required = ["ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_ADMISSION_NUMBER", "ADMIN_PASSWORD"];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}

const config = loadConfig();
const database = createDatabase(config.database);

try {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await database.execute(
    `INSERT INTO users2
      (name, email, admission_number, password, phone_number, role)
     VALUES (?, ?, ?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE
       name = VALUES(name), password = VALUES(password), role = 'admin',
       phone_number = VALUES(phone_number)`,
    [
      process.env.ADMIN_NAME.trim(),
      process.env.ADMIN_EMAIL.trim().toLowerCase(),
      process.env.ADMIN_ADMISSION_NUMBER.trim(),
      password,
      process.env.ADMIN_PHONE_NUMBER?.trim() || null,
    ]
  );
  console.log("Admin account created or updated");
} finally {
  await database.end();
}
