import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

import { validateReleaseEnvironment } from "../scripts/validate-release-env.mjs";

const require = createRequire(import.meta.url);
const { createAppConfig } = require("../app.config.js");

const previewEnvironment = {
  EAS_BUILD_PROFILE: "preview",
  EXPO_PUBLIC_API_URL: "https://staging-api.example.com",
  EAS_PROJECT_ID: "00000000-0000-4000-8000-000000000000",
  EXPO_OWNER: "tunza-su",
};

test("development does not require cloud release settings", () => {
  assert.deepEqual(validateReleaseEnvironment({ APP_VARIANT: "development" }), []);
});

test("preview builds require HTTPS and EAS identity", () => {
  const errors = validateReleaseEnvironment({
    EAS_BUILD_PROFILE: "preview",
    EXPO_PUBLIC_API_URL: "http://localhost:4000",
  });
  assert.ok(errors.includes("EXPO_PUBLIC_API_URL must use HTTPS for release builds"));
  assert.ok(errors.includes("EAS_PROJECT_ID is required"));
  assert.ok(errors.includes("EXPO_OWNER is required"));
});

test("preview release settings accept a secure staging endpoint", () => {
  assert.deepEqual(validateReleaseEnvironment(previewEnvironment), []);
});

test("production builds require every Google OAuth client", () => {
  const errors = validateReleaseEnvironment({
    ...previewEnvironment,
    EAS_BUILD_PROFILE: "production",
  });
  assert.equal(errors.filter((error) => error.includes("GOOGLE")).length, 3);
});

test("preview and production builds use distinct application identities", () => {
  const preview = createAppConfig({
    APP_VARIANT: "preview",
    EAS_PROJECT_ID: previewEnvironment.EAS_PROJECT_ID,
    EXPO_OWNER: previewEnvironment.EXPO_OWNER,
  });
  const production = createAppConfig({ APP_VARIANT: "production" });

  assert.equal(preview.android.package, "com.tunzasu.app.beta");
  assert.equal(preview.ios.bundleIdentifier, "com.tunzasu.app.beta");
  assert.equal(preview.updates.enabled, true);
  assert.equal(production.android.package, "com.tunzasu.app");
  assert.equal(production.ios.bundleIdentifier, "com.tunzasu.app");
  assert.equal(production.updates.enabled, false);
  assert.deepEqual(preview.android.blockedPermissions, [
    "android.permission.RECORD_AUDIO",
  ]);
});
