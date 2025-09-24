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
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabaseClient] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const client = createClient()
      setSupabaseClient(client)
    } catch (err) {
      console.error("Failed to initialize Supabase client:", err)
      setError("Failed to initialize authentication system")
      setIsLoading(false)
      return
    }
  }, [])

  useEffect(() => {
    if (!supabase) return

    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setIsLoading(false)
          return
        }

        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role, is_admin")
              .eq("id", session.user.id)
              .single()

            if (profileError) {
              console.log("Profile not found, using defaults:", profileError)
            }

            setUser({
              ...session.user,
              role: profile?.role || "user",
              is_admin: profile?.is_admin || false,
            })
          } catch (profileErr) {
            console.error("Error fetching profile:", profileErr)
            // Still set user even if profile fetch fails
            setUser({
              ...session.user,
              role: "user",
              is_admin: false,
            })
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        setError("Failed to load user session")
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

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
  }, [supabase])

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
    if (!supabase) {
      throw new Error("Authentication system not initialized")
    }

    try {
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, is_admin")
            .eq("id", data.user.id)
            .single()

          setUser({
            ...data.user,
            role: profile?.role || "user",
            is_admin: profile?.is_admin || false,
          })
        } catch (profileErr) {
          console.error("Error fetching profile during login:", profileErr)
          // Still set user even if profile fetch fails
          setUser({
            ...data.user,
            role: "user",
            is_admin: false,
          })
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      setError(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    if (!supabase) {
      throw new Error("Authentication system not initialized")
    }

    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed"
      setError(errorMessage)
      console.error("Logout error:", error)
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    if (!supabase) {
      throw new Error("Authentication system not initialized")
    }

    try {
      setError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:5000'}/auth/callback`
        },
      })

      if (error) throw error

      // Note: User will be null until email is confirmed
      if (data.user && data.user.email_confirmed_at) {
        setUser({
          ...data.user,
          role: "user",
          is_admin: false,
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed"
      setError(errorMessage)
      throw error
    }
  }

  // If there's a critical error and no supabase client, show error state
  if (error && !supabase) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          login: async () => { throw new Error(error) },
          signup: async () => { throw new Error(error) },
          logout: async () => { throw new Error(error) },
          isLoading: false,
          setUser: () => {},
          error,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        setUser,
        error,
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