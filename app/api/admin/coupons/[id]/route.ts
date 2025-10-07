import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const couponData = await request.json()

    const { data: coupon, error: dbError } = await supabase
      .from("coupons")
      .update(couponData)
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      console.error("Error updating coupon:", dbError)
      return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Error in coupon PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { error: dbError } = await supabase.from("coupons").delete().eq("id", id)

    if (dbError) {
      console.error("Error deleting coupon:", dbError)
      return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in coupon DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const updateData = await request.json()

    const { data: coupon, error: dbError } = await supabase
      .from("coupons")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      console.error("Error updating coupon:", dbError)
      return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
    }

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Error in coupon PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
