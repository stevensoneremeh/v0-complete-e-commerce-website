import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function checkAdminAccess() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      },
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { isAdmin: false, user: null, error: "Not authenticated" }
    }

    try {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("is_admin, role")
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

      return { isAdmin: true, user, error: null }
    } catch (error) {
      console.error("[v0] Admin verification error:", error)
      return { isAdmin: false, user: null, error: "Failed to verify admin status" }
    }
  } catch (error) {
    console.error("[v0] Admin check error:", error)
    return { isAdmin: false, user: null, error: "Failed to verify admin status" }
  }
}
