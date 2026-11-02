import { pathToFileURL } from "node:url";

const releaseProfiles = new Set(["preview", "production"]);
const profile = process.env.EAS_BUILD_PROFILE || process.env.APP_VARIANT;

export function validateReleaseEnvironment(env = process.env) {
  const currentProfile = env.EAS_BUILD_PROFILE || env.APP_VARIANT;
  if (!releaseProfiles.has(currentProfile)) return [];

  const errors = [];
  const apiUrl = env.EXPO_PUBLIC_API_URL?.trim();
  if (!apiUrl) errors.push("EXPO_PUBLIC_API_URL is required");
  else if (!apiUrl.startsWith("https://")) {
    errors.push("EXPO_PUBLIC_API_URL must use HTTPS for release builds");
  }

  if (!env.EAS_PROJECT_ID?.trim()) errors.push("EAS_PROJECT_ID is required");
  if (!env.EXPO_OWNER?.trim()) errors.push("EXPO_OWNER is required");

  const sentryDsn = env.EXPO_PUBLIC_SENTRY_DSN?.trim();
  if (sentryDsn && !sentryDsn.startsWith("https://")) {
    errors.push("EXPO_PUBLIC_SENTRY_DSN must use HTTPS");
  }

  for (const key of ["EXPO_PUBLIC_SUPPORT_URL", "EXPO_PUBLIC_PRIVACY_URL"]) {
    const value = env[key]?.trim();
    if (!value) errors.push(`${key} is required`);
    else if (!value.startsWith("https://")) errors.push(`${key} must use HTTPS`);
  }

  const supportEmail = env.EXPO_PUBLIC_SUPPORT_EMAIL?.trim();
  if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
    errors.push("EXPO_PUBLIC_SUPPORT_EMAIL must be a valid email address");
  }

  for (const key of [
    "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID",
    "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID",
    "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID",
  ]) {
    if (!env[key]?.trim()) errors.push(`${key} is required`);
  }

  return errors;
}

const isMainModule =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule && profile) {
  const errors = validateReleaseEnvironment();
  if (errors.length) {
    console.error(`Release environment is invalid:\n- ${errors.join("\n- ")}`);
    process.exitCode = 1;
  } else if (releaseProfiles.has(profile)) {
    console.log(`Release environment validated for ${profile}.`);
  }
}
