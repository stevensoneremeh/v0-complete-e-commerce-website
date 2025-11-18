import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function verifyAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("[v0] Supabase environment variables not configured")
    return { 
      supabase: null, 
      error: NextResponse.json({ error: "Service not configured" }, { status: 503 })
    }
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
      return { 
        supabase: null, 
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin, role")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      console.warn("[v0] Error fetching profile:", profileError)
      return { 
        supabase: null, 
        error: NextResponse.json({ error: "Error verifying admin status" }, { status: 500 })
      }
    }

    const isAdmin = profile?.is_admin === true || profile?.role === "admin"

    if (!isAdmin) {
      return {
        supabase: null,
        error: NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
      }
    }

    return { supabase, error: null }
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return { 
      supabase: null, 
      error: NextResponse.json({ error: "Verification failed" }, { status: 500 })
    }
  }
}
