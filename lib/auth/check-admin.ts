import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

export async function checkAdminAccess() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase environment variables")
      return { isAdmin: false, user: null, error: "Configuration error" }
    }

    const cookieStore = await cookies()

    const supabaseAuth = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Handle errors silently during cookie operations
          }
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser()

    if (authError || !user) {
      return { isAdmin: false, user: null, error: "Not authenticated" }
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("is_admin, role, full_name, email")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[v0] Profile check error:", profileError)
      return { isAdmin: false, user, error: "Failed to verify admin status" }
    }

    const isAdmin = profile?.is_admin === true || profile?.role === "admin"

    if (!isAdmin) {
      return { isAdmin: false, user, error: "User is not an admin" }
    }

    return {
      isAdmin: true,
      user: {
        ...user,
        fullName: profile.full_name,
        email: profile.email,
      },
      error: null,
    }
  } catch (error) {
    console.error("[v0] Admin check error:", error)
    return { isAdmin: false, user: null, error: "Failed to verify admin status" }
  }
}
