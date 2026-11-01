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
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: "web-client.apps.exampleusercontent.com",
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: "ios-client.apps.exampleusercontent.com",
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID:
    "android-client.apps.exampleusercontent.com",
  EXPO_PUBLIC_SUPPORT_EMAIL: "support@example.com",
  EXPO_PUBLIC_SUPPORT_URL: "https://support.example.com/tunza-su",
  EXPO_PUBLIC_PRIVACY_URL: "https://support.example.com/tunza-su/privacy",
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

test("release builds require every Google OAuth client", () => {
  const errors = validateReleaseEnvironment({
    EAS_PROJECT_ID: previewEnvironment.EAS_PROJECT_ID,
    EXPO_OWNER: previewEnvironment.EXPO_OWNER,
    EXPO_PUBLIC_API_URL: previewEnvironment.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_SUPPORT_EMAIL: previewEnvironment.EXPO_PUBLIC_SUPPORT_EMAIL,
    EXPO_PUBLIC_SUPPORT_URL: previewEnvironment.EXPO_PUBLIC_SUPPORT_URL,
    EXPO_PUBLIC_PRIVACY_URL: previewEnvironment.EXPO_PUBLIC_PRIVACY_URL,
    EAS_BUILD_PROFILE: "production",
  });
  assert.equal(errors.filter((error) => error.includes("GOOGLE")).length, 3);
});

test("release builds require public support and privacy links", () => {
  const errors = validateReleaseEnvironment({
    ...previewEnvironment,
    EXPO_PUBLIC_SUPPORT_EMAIL: "not-an-email",
    EXPO_PUBLIC_PRIVACY_URL: "http://example.com/privacy",
  });
  assert.ok(errors.includes("EXPO_PUBLIC_SUPPORT_EMAIL must be a valid email address"));
  assert.ok(errors.includes("EXPO_PUBLIC_PRIVACY_URL must use HTTPS"));
});

test("a support email is optional when the support URL is configured", () => {
  assert.deepEqual(
    validateReleaseEnvironment({
      ...previewEnvironment,
      EXPO_PUBLIC_SUPPORT_EMAIL: "",
    }),
    [],
  );
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
