"use client";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { apiUrl } from "../config/api";


const AuthContext = createContext(undefined);
WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const TOKEN_KEY = "tunza_access_token";
const USER_KEY = "tunza_user";

async function readToken() {
  return Platform.OS === "web"
    ? AsyncStorage.getItem(TOKEN_KEY)
    : SecureStore.getItemAsync(TOKEN_KEY);
}

async function writeToken(value) {
  return Platform.OS === "web"
    ? AsyncStorage.setItem(TOKEN_KEY, value)
    : SecureStore.setItemAsync(TOKEN_KEY, value);
}

async function removeToken() {
  return Platform.OS === "web"
    ? AsyncStorage.removeItem(TOKEN_KEY)
    : SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Google Auth Request setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  const persistSession = useCallback(async (session) => {
    await Promise.all([
      writeToken(session.accessToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(session.user)),
    ]);
    setToken(session.accessToken);
    setUser(session.user);
  }, []);

  const clearSession = useCallback(async () => {
    await Promise.all([
      removeToken(),
      AsyncStorage.multiRemove([USER_KEY, "user", "token", "refreshToken"]),
    ]);
    setUser(null);
    setToken("");
  }, []);

  // Handle Google sign-in response
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        try {
          const idToken =
            response.authentication?.idToken || response.params?.id_token;
          if (!idToken) throw new Error("Google did not return an identity token");
          const backendRes = await fetch(apiUrl("/auth/google"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          if (!backendRes.ok)
            throw new Error("Google sign-in was rejected by the server");
          await persistSession(await backendRes.json());
        } catch (error) {
          console.error("Google sign-in error:", error);
        }
      }
    };
    handleGoogleResponse();
  }, [persistSession, response]);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedToken = await readToken();
      if (!storedToken) return;
      const response = await fetch(apiUrl("/auth/me"), {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (!response.ok) return clearSession();
      const { user: currentUser } = await response.json();
      setToken(storedToken);
      setUser(currentUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } catch (error) {
      console.error("Error checking auth state:", error);
      await clearSession();
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!request) return false;
    return promptAsync();
  };

  const login = async (email, password) => {
    try {
      // API call for regular users
      const response = await fetch(apiUrl("/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        await persistSession(await response.json());
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(apiUrl("/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        await persistSession(await response.json());
        return { success: true };
      } else {
        const errorData = await response.text();

        // Parse the error response to get the specific message
        let errorMessage = "Registration failed. Please try again.";
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // If parsing fails, use the raw error data
          errorMessage = errorData || errorMessage;
        }

        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Network error. Please check your connection.",
      };
    }
  };

  const logout = async () => {
    try {
      await clearSession();
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      setToken("");
    }
  };

  const authFetch = useCallback(
    async (path, options = {}) => {
      const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(apiUrl(path), { ...options, headers });
      if (response.status === 401) await clearSession();
      return response;
    },
    [clearSession, token]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
