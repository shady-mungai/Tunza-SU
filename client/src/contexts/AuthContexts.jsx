"use client";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import emailjs from "@emailjs/react-native";
import { apiUrl } from "../config/api";


const AuthContext = createContext(undefined);
WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  // Google Auth Request setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    useProxy: true,
  });

  // Handle Google sign-in response
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const accessToken = response.authentication.accessToken;
        try {
          const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const googleUser = await res.json();
          // Send Google user info to backend to get or create app user
          const backendRes = await fetch(apiUrl("/auth/google"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(googleUser),
          });
          if (!backendRes.ok)
            throw new Error("Failed to sync Google user with backend");
          const appUser = await backendRes.json();
          await AsyncStorage.setItem("user", JSON.stringify(appUser));
          setUser(appUser);
        } catch (error) {
          console.error("Google sign-in error:", error);
        }
      }
    };
    handleGoogleResponse();
  }, [response]);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    promptAsync();
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
        const userData = await response.json();
        setUser(userData.user);
        await AsyncStorage.setItem("user", JSON.stringify(userData.user));
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
        const result = await response.json();
        setUser(result.user);
        await AsyncStorage.setItem("user", JSON.stringify(result.user));
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
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("user");

      // Clear any other stored tokens or session data
      await AsyncStorage.multiRemove(["user", "token", "refreshToken"]);

      // Reset user state
      setUser(null);
      setToken("");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, we should still clear the user state
      setUser(null);
      setToken("");
    }
  };

  // code to send an email to users
  const sendMail = (object) => {
    const { to_name, to_email, location, priority, category, status } = object;

    const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = to_email
      ? process.env.EXPO_PUBLIC_EMAILJS_RESOLVED_REPORT_TEMPLATE_ID
      : process.env.EXPO_PUBLIC_EMAILJS_NEW_REPORT_TEMPLATE_ID;
    const publicKey = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      return Promise.resolve({ skipped: true });
    }

    return emailjs.send(
      serviceId,
      templateId,
      {
        to_name,
        to_email,
        location,
        priority,
        category,
        status,
      },
      { publicKey }
    );
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        sendMail
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
