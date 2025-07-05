"use client"

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { WEB_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import * as AuthSession from "expo-auth-session";

const AuthContext = createContext(undefined)
WebBrowser.maybeCompleteAuthSession();

console.log(`RedirectURl is: ${AuthSession.makeRedirectUri({ useProxy: true })}`);

export function AuthProvider({ children }) {
  const [user, setUser] = useState('')
  const [loading, setLoading] = useState(true)
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
          if (!backendRes.ok) throw new Error("Failed to sync Google user with backend");
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
      const userData = await AsyncStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    promptAsync();
  }

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
        }
        setUser(adminUser)
        await AsyncStorage.setItem("user", JSON.stringify(adminUser))
        return true
      }
      // API call for regular users
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
        console.log(`The user logged in is: ${user}`);
        await AsyncStorage.setItem("user", JSON.stringify(userData.user))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      if (response.ok) {
        const result = await response.json()
        setUser(result.user)
        await AsyncStorage.setItem("user", JSON.stringify(result.user))
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

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
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
