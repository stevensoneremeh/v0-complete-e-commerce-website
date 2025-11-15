import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function verifyAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("[v0] Supabase environment variables not configured")
    return { isAdmin: false, error: "Service not configured" }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Ignored in Server Component context
          }
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { isAdmin: false, error: "Unauthorized" }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin, role")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.warn("[v0] Error fetching profile:", profileError)
      return { isAdmin: false, error: "Error verifying admin status" }
    }

    const isAdmin = profile?.is_admin === true || profile?.role === "admin"

    return { isAdmin, error: null }
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return { isAdmin: false, error: "Verification failed" }
  }
}
