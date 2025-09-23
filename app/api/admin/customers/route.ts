import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { verifyAdmin } from "../auth/middleware"

export async function GET(request: NextRequest) {
  // Check admin access
  const adminCheck = await verifyAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
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

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")

    let query = supabase
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        phone,
        address,
        city,
        country,
        role,
        is_admin,
        created_at,
        updated_at,
        last_sign_in_at
      `)
      .order("created_at", { ascending: false })

    if (role) {
      query = query.eq("role", role)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data: customers, error } = await query

    if (error) {
      console.error("Error fetching customers:", error)
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
    }

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error in customers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Check admin access
  const adminCheck = await verifyAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
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

    const customerData = await request.json()

    // Create user account first
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: customerData.email,
      password: customerData.password || "TempPassword123!",
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    // Update profile with additional info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        country: customerData.country,
        role: customerData.role || "user",
        is_admin: customerData.role === "admin",
      })
      .eq("id", authUser.user.id)
      .select()
      .single()

    if (profileError) {
      console.error("Error updating profile:", profileError)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ customer: profile }, { status: 201 })
  } catch (error) {
    console.error("Error in customer creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
