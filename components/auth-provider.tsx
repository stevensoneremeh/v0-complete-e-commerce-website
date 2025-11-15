"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js"

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
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  let supabase: ReturnType<typeof createClient> | null = null
  try {
    supabase = createClient()
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        if (!supabase) {
          setIsLoading(false)
          return
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && session.expires_at && session.expires_at * 1000 > Date.now()) {
          await fetchUserProfile(session.user)
        } else if (session?.user) {
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.error("[v0] Error getting session:", error)
        if (supabase) {
          try {
            await supabase.auth.signOut()
          } catch (e) {
            // Ignore errors when signing out
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    if (!supabase) {
      setIsLoading(false)
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_OUT" || !session) {
        setUser(null)
      } else if (session?.user) {
        await fetchUserProfile(session.user)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      if (!supabase) return

      const response = await fetch("/api/auth/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to verify user")
      }

      const data = await response.json()

      const userData: User = {
        id: supabaseUser.id,
        name: data.user?.fullName || supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email || "",
        role: data.isAdmin ? "admin" : "user",
        avatar: supabaseUser.user_metadata?.avatar_url,
      }

      setUser(userData)
    } catch (error) {
      console.error("[v0] Error in fetchUserProfile:", error)
      // Still set basic user data even if profile fetch fails
      const userData: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email || "",
        role: "user",
        avatar: supabaseUser.user_metadata?.avatar_url,
      }
      setUser(userData)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (!supabase) {
        throw new Error("Supabase client not available")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        await fetchUserProfile(data.user)
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (!supabase) return
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      if (!supabase) {
        throw new Error("Supabase client not available")
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        try {
          await fetch("/api/auth/setup-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              fullName: name,
            }),
          })
        } catch (err) {
          console.error("[v0] Error setting up profile:", err)
        }

        if (data.user.email_confirmed_at) {
          await fetchUserProfile(data.user)
        }
      }
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        isLoading,
        setUser,
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
