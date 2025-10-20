import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function verifyAdmin() {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured")
    return { supabase: null, error: NextResponse.json({ error: "Service not configured" }, { status: 503 }) }
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  })

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { supabase: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    return { supabase: null, error: NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 }) }
  }

  return { supabase, error: null }
}
