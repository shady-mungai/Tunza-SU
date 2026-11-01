import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readdir, readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

import { loadConfig } from "../src/config.js";

const config = loadConfig();
const connection = await mysql.createConnection({
  ...config.database,
  multipleStatements: true,
});

const migrationsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations"
);

try {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL PRIMARY KEY,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  const [appliedRows] = await connection.query("SELECT name FROM schema_migrations");
  const applied = new Set(appliedRows.map((row) => row.name));
  const files = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const name of files) {
    if (applied.has(name)) continue;
    const sql = await readFile(path.join(migrationsDirectory, name), "utf8");
    await connection.beginTransaction();
    try {
      await connection.query(sql);
      await connection.execute("INSERT INTO schema_migrations (name) VALUES (?)", [name]);
      await connection.commit();
      console.log(`Applied migration ${name}`);
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  }
} finally {
  await connection.end();
}
