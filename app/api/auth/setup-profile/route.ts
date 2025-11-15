import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 503 })
  }

  const { userId, email, fullName } = await request.json()

  if (!userId || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

  const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()

  if (existingProfile) {
    return NextResponse.json({ success: true, message: "Profile already exists" })
  }

  const ADMIN_EMAILS = ["talktostevenson@gmail.com"]
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase())

  const { error } = await supabase.from("profiles").insert({
    id: userId,
    email,
    full_name: fullName || "",
    is_admin: isAdmin,
    role: isAdmin ? "admin" : "user",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("[v0] Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile", details: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, isAdmin })
}
