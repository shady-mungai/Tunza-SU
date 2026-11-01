import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, readFile, rm } from "node:fs/promises";

import { loadConfig } from "../src/config.js";
import { createNotifier } from "../src/services/notifier.js";
import { createStorage } from "../src/services/storage.js";

const baseEnvironment = {
  JWT_SECRET: "test-secret-that-is-at-least-thirty-two-characters",
};

test("production storage configuration fails fast when S3 settings are missing", () => {
  assert.throws(
    () => loadConfig({ ...baseEnvironment, STORAGE_DRIVER: "s3" }),
    /S3_BUCKET is required/
  );
});

test("SMTP credentials must be configured as a pair", () => {
  assert.throws(
    () =>
      loadConfig({
        ...baseEnvironment,
        SMTP_HOST: "smtp.example.com",
        SMTP_USER: "mailer",
        MAIL_FROM: "Tunza SU <noreply@example.com>",
      }),
    /SMTP_USER and SMTP_PASSWORD/
  );
});

test("explicit S3 credentials must be configured as a pair", () => {
  assert.throws(
    () =>
      loadConfig({
        ...baseEnvironment,
        STORAGE_DRIVER: "s3",
        S3_BUCKET: "tunza-reports",
        S3_REGION: "auto",
        S3_ACCESS_KEY_ID: "access-key",
      }),
    /S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY/
  );
});

test("observability sampling must stay between zero and one", () => {
  assert.throws(
    () =>
      loadConfig({
        ...baseEnvironment,
        SENTRY_TRACES_SAMPLE_RATE: "1.5",
      }),
    /between 0 and 1/
  );

  const config = loadConfig({
    ...baseEnvironment,
    NODE_ENV: "production",
    SENTRY_DSN: "https://public@example.invalid/1",
    SENTRY_TRACES_SAMPLE_RATE: "0.1",
  });
  assert.equal(config.observability.environment, "production");
  assert.equal(config.observability.tracesSampleRate, 0.1);
});

test("local storage writes, resolves, and removes generated object keys", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "tunza-storage-"));
  const storage = createStorage({
    driver: "local",
    localDirectory: directory,
    s3: null,
  });

  try {
    const stored = await storage.save({
      buffer: Buffer.from("image bytes"),
      mime: "image/png",
      extension: ".png",
    });
    assert.match(stored.key, /^[0-9a-f-]+\.png$/);
    assert.equal(await readFile(path.join(directory, stored.key), "utf8"), "image bytes");
    assert.equal(await storage.urlFor(stored.key), `/uploads/${stored.key}`);

    await storage.remove(stored.key);
    await assert.rejects(readFile(path.join(directory, stored.key)), /ENOENT/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("backend notifier builds administrator and student messages", async () => {
  const messages = [];
  const notifier = createNotifier(
    {
      enabled: true,
      host: "smtp.example.com",
      port: 587,
      secure: false,
      user: null,
      password: null,
      from: "Tunza SU <noreply@example.com>",
      adminRecipients: ["facilities@example.com"],
    },
    {
      transport: {
        async sendMail(message) {
          messages.push(message);
        },
      },
    }
  );

  const report = {
    id: 42,
    title: "Broken lift",
    priority: "urgent",
    category: "Infrastructure",
    location: "Administration block",
    reporter_name: "Test Student",
    reporter_email: "student@example.com",
  };
  await notifier.reportCreated({ report, reporter: { name: "Test Student" } });
  await notifier.reportResolved({ report });

  assert.equal(messages.length, 2);
  assert.deepEqual(messages[0].to, ["facilities@example.com"]);
  assert.equal(messages[1].to, "student@example.com");
  assert.match(messages[1].subject, /#42 resolved/);
});
