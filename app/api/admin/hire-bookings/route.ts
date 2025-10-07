import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    // Get hire service bookings
    const { data: bookings, error: dbError } = await supabase
      .from("hire_bookings")
      .select(`
        *,
        profiles (
          id,
          email,
          full_name
        )
      `)
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching hire bookings:", dbError)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error in hire bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const body = await request.json()

    // Create new hire booking
    const { data: booking, error: dbError } = await supabase
      .from("hire_bookings")
      .insert([
        {
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("Error creating hire booking:", dbError)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in hire bookings POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
