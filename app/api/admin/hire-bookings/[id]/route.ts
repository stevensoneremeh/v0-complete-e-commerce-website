import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

/**
 * GET /api/admin/hire-bookings/[id]
 * Retrieves a single hire booking by ID for admin dashboard
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    // Fetch single hire booking with user profile data
    const { data: booking, error: dbError } = await supabase
      .from("hire_bookings")
      .select(`
        *,
        profiles (
          id,
          email,
          full_name
        )
      `)
      .eq("id", id)
      .single()

    if (dbError) {
      console.error("Error fetching hire booking:", dbError)
      return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in hire booking GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/hire-bookings/[id]
 * Updates an existing hire booking (partial update)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const body = await request.json()

    // Update hire booking
    const { data: booking, error: dbError } = await supabase
      .from("hire_bookings")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      console.error("Error updating hire booking:", dbError)
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error in hire booking PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/hire-bookings/[id]
 * Deletes a hire booking
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    // Delete hire booking
    const { error: dbError } = await supabase.from("hire_bookings").delete().eq("id", id)

    if (dbError) {
      console.error("Error deleting hire booking:", dbError)
      return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in hire booking DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
