import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const body = await request.json()

    const { data, error: dbError } = await supabase.from("product_reviews").update(body).eq("id", id).select().single()

    if (dbError) {
      console.error("Error updating review:", dbError)
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in review PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { error: dbError } = await supabase.from("product_reviews").delete().eq("id", id)

    if (dbError) {
      console.error("Error deleting review:", dbError)
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in review DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
