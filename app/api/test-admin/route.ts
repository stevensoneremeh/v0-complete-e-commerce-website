import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
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
              cookiesToSet.forEach(({ name, value, options }) => 
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore cookie setting errors in server components
            }
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_admin, full_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: "Profile not found", details: profileError.message },
        { status: 404 }
      )
    }

    const isAdmin = profile.is_admin || profile.role === 'admin' || profile.role === 'super_admin'

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required", userRole: profile.role, isAdmin: profile.is_admin },
        { status: 403 }
      )
    }

    // Get some stats for admin dashboard
    const [categoriesResult, productsResult, ordersResult, usersResult] = await Promise.all([
      supabase.from("categories").select("*", { count: 'exact', head: true }),
      supabase.from("products").select("*", { count: 'exact', head: true }),
      supabase.from("orders").select("*", { count: 'exact', head: true }),
      supabase.from("profiles").select("*", { count: 'exact', head: true })
    ])

    return NextResponse.json({
      message: "Admin access granted",
      user: {
        id: user.id,
        email: user.email,
        name: profile.full_name,
        role: profile.role,
        is_admin: profile.is_admin
      },
      stats: {
        categories: categoriesResult.count || 0,
        products: productsResult.count || 0,
        orders: ordersResult.count || 0,
        users: usersResult.count || 0
      },
      timestamp: new Date().toISOString(),
      features: [
        "Product Management",
        "Category Management",
        "Order Management",
        "User Management",
        "Property Management",
        "Analytics Dashboard",
        "Booking Management"
      ]
    })

  } catch (error) {
    console.error("Admin test API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
