import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    let isAdmin = false

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_admin")
        .eq("id", user.id)
        .single()

      if (profile && !profileError) {
        isAdmin = profile.is_admin || profile.role === "admin" || profile.role === "super_admin"
      }
    } catch (error) {
      console.log("Profile check failed, using fallback:", error)
    }

    // Fallback to hardcoded email check
    if (!isAdmin) {
      isAdmin = user.email === "talktostevenson@gmail.com"
    }

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Forbidden - Admin access required",
          userEmail: user.email,
        },
        { status: 403 },
      )
    }

    // Fetch orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (ordersError) {
      console.error("Error fetching orders:", ordersError)
      return NextResponse.json(
        {
          error: "Failed to fetch orders",
          details: ordersError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error("Orders API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
