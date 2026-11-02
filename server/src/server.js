import "dotenv/config";

import { loadConfig } from "./config.js";
import { createDatabase } from "./database.js";
import { createRepositories } from "./repositories/index.js";
import { createTokenService } from "./security/tokens.js";
import { createGoogleVerifier } from "./security/google.js";
import { createApp } from "./createApp.js";
import { createStorage } from "./services/storage.js";
import { createNotifier } from "./services/notifier.js";
import { createObservability } from "./services/observability.js";

const config = loadConfig();
const database = createDatabase(config.database);
const repositories = createRepositories(database);
const tokenService = createTokenService(config.jwt);
const verifyGoogleIdToken = createGoogleVerifier(config.google);
const storage = createStorage(config.storage);
const notifier = createNotifier(config.notifications);
const observability = createObservability(config.observability);

await database.query("SELECT 1");

const app = createApp({
  config,
  repositories,
  tokenService,
  verifyGoogleIdToken,
  storage,
  notifier,
  observability,
  readinessCheck: async () => database.query("SELECT 1"),
});

const server = app.listen(config.port, () => {
  observability.info("server_started", { port: config.port });
});

async function shutdown(signal) {
  observability.info("server_shutdown_started", { signal });
  server.close(async () => {
    await database.end();
    await observability.flush();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
