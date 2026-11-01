import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
const environment =
  process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT?.trim() || "development";

function tracesSampleRate() {
  const value = Number(process.env.EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0;
}

export function initializeObservability() {
  if (!dsn) return false;

  Sentry.init({
    dsn,
    environment,
    release: Constants.expoConfig?.version,
    tracesSampleRate: tracesSampleRate(),
    sendDefaultPii: false,
    enableNativeFramesTracking: true,
  });

  const scope = Sentry.getGlobalScope();
  scope.setTag("expo-update-id", Updates.updateId || "embedded");
  scope.setTag("expo-update-channel", Updates.channel || "development");
  scope.setTag("expo-is-embedded-update", String(Updates.isEmbeddedLaunch));
  return true;
}

export function withObservability(Component) {
  return dsn ? Sentry.wrap(Component) : Component;
}

export function setObservabilityUser(user) {
  if (!dsn) return;
  Sentry.setUser(user ? { id: String(user.id), role: user.role } : null);
}
