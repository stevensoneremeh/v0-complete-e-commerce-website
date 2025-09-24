"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  email: string
  role: "customer" | "admin" | "super_admin"
  avatar?: string
  phone?: string
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  isLoading: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          await fetchUserProfile(session.user)
        }
      } catch (error) {
        console.error("Error getting session:", error)
        if (error.message?.includes("Supabase not configured")) {
          console.warn("Supabase is not properly configured. Please set up environment variables.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[v0] Auth state change:", event, session?.user?.email)

      if (event === "SIGNED_OUT" || !session) {
        console.log("[v0] User signed out, clearing user state")
        setUser(null)
        setIsLoading(false)
      } else if (session?.user) {
        console.log("[v0] User signed in, fetching profile")
        await fetchUserProfile(session.user)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log("[v0] Fetching profile for:", supabaseUser.email)

      let { data: profile, error } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()

      if (error) {
        console.error("[v0] Error fetching profile:", error)
        // If profile doesn't exist, create one (fallback for existing users)
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            full_name: supabaseUser.user_metadata?.full_name || "User",
            role: "customer",
          })
          .select()
          .single()

        if (createError) {
          console.error("[v0] Error creating profile:", createError)
          return
        }

        profile = newProfile
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profile.full_name || supabaseUser.user_metadata?.full_name || "User",
        email: profile.email || supabaseUser.email || "",
        role: profile.role || "customer",
        avatar: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
        phone: profile.phone,
        isVerified: profile.is_verified || false,
      }

      console.log("[v0] User data created:", userData)
      setUser(userData)

      if (userData.role === "admin" || userData.role === "super_admin") {
        console.log("[v0] Admin user detected, redirecting to admin dashboard")
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push("/admin")
        }, 100)
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting login for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error)
        throw new Error(error.message)
      }

      console.log("[v0] Login successful for:", data.user?.email)
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      console.log("[v0] Attempting logout")
      setIsLoading(true)

      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("[v0] Logout error:", error)
      } else {
        console.log("[v0] Logout successful")
      }

      // Clear user state immediately
      setUser(null)
      // Redirect to home page after logout
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("[v0] Attempting signup for:", email)

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
        console.error("[v0] Signup error:", error)
        throw new Error(error.message)
      }

      console.log("[v0] Signup successful for:", data.user?.email)

      // If user is immediately confirmed, the auth state change will handle profile creation
      if (data.user?.email_confirmed_at) {
        console.log("[v0] User immediately confirmed")
      }
    } catch (error) {
      console.error("Signup error:", error)
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
