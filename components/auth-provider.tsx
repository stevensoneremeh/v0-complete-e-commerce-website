"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (name: string, email: string, password: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Admin User",
    email: "admin@shophub.com",
    role: "admin",
  })
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication
    if (email === "admin@shophub.com" && password === "admin") {
      setUser({
        id: "1",
        name: "Admin User",
        email: "admin@shophub.com",
        role: "admin",
      })
    } else if (email === "user@shophub.com" && password === "user") {
      setUser({
        id: "2",
        name: "John Doe",
        email: "user@shophub.com",
        role: "user",
      })
    } else {
      throw new Error("Invalid credentials")
    }
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser({
      id: Date.now().toString(),
      name,
      email,
      role: "user",
    })
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
