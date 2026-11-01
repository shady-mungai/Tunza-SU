import "dotenv/config";

import { loadConfig } from "./config.js";
import { createDatabase } from "./database.js";
import { createRepositories } from "./repositories/index.js";
import { createTokenService } from "./security/tokens.js";
import { createGoogleVerifier } from "./security/google.js";
import { createApp } from "./createApp.js";

const config = loadConfig();
const database = createDatabase(config.database);
const repositories = createRepositories(database);
const tokenService = createTokenService(config.jwt);
const verifyGoogleIdToken = createGoogleVerifier(config.google);

await database.query("SELECT 1");

const app = createApp({
  config,
  repositories,
  tokenService,
  verifyGoogleIdToken,
});

const server = app.listen(config.port, () => {
  console.log(`Tunza SU API listening on port ${config.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await database.end();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
