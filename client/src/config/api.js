import Constants from "expo-constants";

const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const developmentHost = Constants.expoConfig?.hostUri?.split(":")[0];
const developmentBaseUrl = developmentHost
  ? `http://${developmentHost}:4000`
  : "http://localhost:4000";

export const API_BASE_URL = (configuredBaseUrl || developmentBaseUrl).replace(
  /\/+$/,
  ""
);

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
