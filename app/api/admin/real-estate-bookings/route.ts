import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: bookings, error: dbError } = await supabase
      .from("real_estate_bookings")
      .select(`
        *,
        real_estate_properties (
          title,
          address,
          city,
          state
        )
      `)
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching real estate bookings:", dbError)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error in real estate bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
