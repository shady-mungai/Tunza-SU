"use client";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import * as AuthSession from "expo-auth-session";

const AuthContext = createContext(undefined);
WebBrowser.maybeCompleteAuthSession();

console.log(
  `RedirectURl is: ${AuthSession.makeRedirectUri({ useProxy: true })}`
);

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
    console.log("Google response:", response);
    const handleGoogleResponse = async () => {
      if (response?.type === "success") {
        const accessToken = response.authentication.accessToken;
        try {
          const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const googleUser = await res.json();
          // Send Google user info to backend to get or create app user
          const backendRes = await fetch("http://localhost:4000/auth/google", {
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
      // Hardcoded admin check
      if (email === "admin@tunzasu.com" && password === "admin123") {
        const adminUser = {
          id: "admin",
          name: "System Administrator",
          email: "admin@tunzasu.com",
          phoneNumber: "+1234567890",
          role: "admin",
        };
        setUser(adminUser);
        await AsyncStorage.setItem("user", JSON.stringify(adminUser));
        return true;
      }
      // API call for regular users
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        console.log("[AuthContext] Setting user after login:", userData.user);
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
      console.log("[AuthContext] Registering with data:", userData);
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log("[AuthContext] Register response status:", response.status);
      if (response.ok) {
        const result = await response.json();
        console.log("[AuthContext] Register success:", result);
        setUser(result.user);
        await AsyncStorage.setItem("user", JSON.stringify(result.user));
        return { success: true };
      } else {
        const errorData = await response.text();
        console.log("[AuthContext] Register error response:", errorData);

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
      console.log("[Logout] Called for user:", user);
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("user");
      const userAfterRemove = await AsyncStorage.getItem("user");
      console.log("[Logout] user after remove:", userAfterRemove);

      // Clear any other stored tokens or session data
      await AsyncStorage.multiRemove(["user", "token", "refreshToken"]);
      const userAfterMultiRemove = await AsyncStorage.getItem("user");
      console.log("[Logout] user after multiRemove:", userAfterMultiRemove);

      // Reset user state
      setUser(null);
      setToken("");
      console.log("[Logout] State reset to null");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, we should still clear the user state
      setUser(null);
      setToken("");
    }
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
