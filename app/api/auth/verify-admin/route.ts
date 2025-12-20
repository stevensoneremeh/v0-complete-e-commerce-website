import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 })
  }

  const cookieStore = await cookies()

  const supabaseAuth = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  } = await supabaseAuth.auth.getUser()

  if (authError || !user) {
    console.log("[v0] User not authenticated in verify-admin")
    return NextResponse.json({ isAdmin: false, user: null })
  }

  console.log("[v0] Verifying admin status for:", user.email)

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, is_admin, role, full_name")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    console.error("[v0] Profile error:", profileError)
    return NextResponse.json({
      isAdmin: false,
      user: { id: user.id, email: user.email },
    })
  }

  const isAdmin = profile.is_admin === true || profile.role === "admin"

  console.log("[v0] Admin verification result:", { email: profile.email, isAdmin, role: profile.role })

  return NextResponse.json({
    isAdmin,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: isAdmin ? "admin" : "user",
    },
  })
}
