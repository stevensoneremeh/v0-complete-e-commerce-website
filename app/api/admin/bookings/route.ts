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

    // Fetch property bookings
    const { data: propertyBookings, error: propertyError } = await supabase
      .from("real_estate_bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (propertyError) {
      console.error("Error fetching property bookings:", propertyError)
      return NextResponse.json(
        {
          error: "Failed to fetch property bookings",
          details: propertyError.message,
        },
        { status: 500 },
      )
    }

    // Fetch hire bookings
    const { data: hireBookings, error: hireError } = await supabase
      .from("hire_bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (hireError) {
      console.error("Error fetching hire bookings:", hireError)
    }

    return NextResponse.json({
      propertyBookings: propertyBookings || [],
      hireBookings: hireBookings || [],
    })
  } catch (error) {
    console.error("Bookings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
