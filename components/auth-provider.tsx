"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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

  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && session.expires_at && session.expires_at * 1000 > Date.now()) {
          await fetchUserProfile(session.user)
        } else if (session?.user) {
          // Session expired, clear it
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.error("Error getting session:", error)
        // Clear any invalid session
        await supabase.auth.signOut()
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      const ADMIN_EMAIL = "talktostevenson@gmail.com"
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()

      // Auto-grant admin access to designated admin email
      if (supabaseUser.email === ADMIN_EMAIL) {
        if (!profile || !profile.is_admin) {
          // Upsert profile with admin privileges
          await supabase
            .from("profiles")
            .upsert({
              id: supabaseUser.id,
              email: supabaseUser.email,
              full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || "Admin User",
              is_admin: true,
              role: "admin",
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })
        }
        
        const userData: User = {
          id: supabaseUser.id,
          name: profile?.full_name || supabaseUser.user_metadata?.full_name || "Admin User",
          email: supabaseUser.email || "",
          role: "admin",
          avatar: supabaseUser.user_metadata?.avatar_url,
        }
        
        setUser(userData)
        return
      }

      // For non-admin users
      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError)
        return
      }

      const userData: User = {
        id: supabaseUser.id,
        name: profile?.full_name || supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email || "",
        role: profile?.is_admin ? "admin" : "user",
        avatar: supabaseUser.user_metadata?.avatar_url,
      }

      setUser(userData)
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
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
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
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

      // Create profile record
      if (data.user) {
        // Auto-grant admin access to designated admin email
        const ADMIN_EMAIL = "talktostevenson@gmail.com"
        const isAdmin = data.user.email === ADMIN_EMAIL

        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: name,
            is_admin: isAdmin,
            role: isAdmin ? "admin" : "user",
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }

        // If user is immediately confirmed, fetch profile
        if (data.user.email_confirmed_at) {
          await fetchUserProfile(data.user)
        }
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
