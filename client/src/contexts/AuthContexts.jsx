"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

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

  const loginWithGoogle = async () => {
    try {
      // Implement Google Sign-In logic here
      // This is a placeholder - you'll need to configure Google Sign-In
      console.log("Google Sign-In not implemented yet")
      return false
    } catch (error) {
      console.error("Google login error:", error)
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
