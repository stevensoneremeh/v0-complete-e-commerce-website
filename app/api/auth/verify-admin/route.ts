import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 })
  }

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
    return NextResponse.json({ isAdmin: false, user: null })
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, is_admin, role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({
      isAdmin: false,
      user: { id: user.id, email: user.email },
    })
  }

  const isAdmin = profile.is_admin === true || profile.role === "admin"

  return NextResponse.json({
    isAdmin,
    user: {
      id: profile.id,
      email: profile.email,
      role: isAdmin ? "admin" : "user",
    },
  })
}
