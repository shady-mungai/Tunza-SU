const base = require("./app.json");

function createAppConfig(env = process.env) {
  const variant = env.APP_VARIANT || "development";
  const isProduction = variant === "production";
  const isPreview = variant === "preview";
  const identifier = isProduction ? "com.tunzasu.app" : "com.tunzasu.app.beta";
  const projectId = env.EAS_PROJECT_ID?.trim();

  return {
    ...base.expo,
    name: isProduction ? "Tunza SU" : "Tunza SU Beta",
    scheme: isProduction ? "tunzasu" : "tunzasu-beta",
    version: "1.0.0",
    runtimeVersion: { policy: "appVersion" },
    ios: {
      ...base.expo.ios,
      bundleIdentifier: identifier,
    },
    android: {
      ...base.expo.android,
      package: identifier,
      blockedPermissions: ["android.permission.RECORD_AUDIO"],
    },
    updates: {
      enabled: Boolean(projectId),
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      ...(projectId ? { url: `https://u.expo.dev/${projectId}` } : {}),
    },
    extra: {
      appVariant: variant,
      ...(projectId ? { eas: { projectId } } : {}),
    },
    owner: env.EXPO_OWNER?.trim() || undefined,
    description:
      "Report, assign, and track campus infrastructure maintenance securely.",
    ...(isPreview ? { privacy: "unlisted" } : {}),
  };
}

module.exports = () => createAppConfig();
module.exports.createAppConfig = createAppConfig;
