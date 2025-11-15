import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing environment variables" }, { status: 500 })
  }

  const { userId, email, fullName } = await request.json()

  if (!userId || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  })

  const ADMIN_EMAIL = "talktostevenson@gmail.com"
  const isAdmin = email === ADMIN_EMAIL

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      is_admin: isAdmin,
      role: isAdmin ? "admin" : "user",
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    },
  )

  if (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
