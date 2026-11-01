const baseExpo = {
  scheme: "tunzasu",
  name: "Tunza SU",
  slug: "tunza-su",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.tunzasu.app",
  },
  android: {
    package: "com.tunzasu.app",
  },
  web: {
    bundler: "metro",
  },
  plugins: [
    [
      "expo-image-picker",
      {
        photosPermission:
          "Allow Tunza SU to attach photos to maintenance reports.",
        cameraPermission:
          "Allow Tunza SU to take photos for maintenance reports.",
      },
    ],
    "expo-secure-store",
    "expo-web-browser",
    "@sentry/react-native",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 240,
        resizeMode: "contain",
        backgroundColor: "#F8FAF7",
      },
    ],
  ],
};

function createAppConfig(env = process.env) {
  const variant = env.APP_VARIANT || "development";
  const isProduction = variant === "production";
  const isPreview = variant === "preview";
  const identifier = isProduction ? "com.tunzasu.app" : "com.tunzasu.app.beta";
  const projectId = env.EAS_PROJECT_ID?.trim();

  return {
    ...baseExpo,
    name: isProduction ? "Tunza SU" : "Tunza SU Beta",
    scheme: isProduction ? "tunzasu" : "tunzasu-beta",
    version: "1.0.0",
    icon: "./assets/icon.png",
    runtimeVersion: { policy: "appVersion" },
    ios: {
      ...baseExpo.ios,
      bundleIdentifier: identifier,
    },
    android: {
      ...baseExpo.android,
      package: identifier,
      blockedPermissions: ["android.permission.RECORD_AUDIO"],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#F8FAF7",
      },
    },
    web: {
      ...baseExpo.web,
      favicon: "./assets/favicon.png",
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
