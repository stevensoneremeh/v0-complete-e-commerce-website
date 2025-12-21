import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (dbError) {
      console.error("Error fetching customer:", dbError)
      return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error in customer GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const updates = await request.json()

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      console.error("Error updating customer:", dbError)
      return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error in customer PATCH API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    // First, delete the user from auth (this will cascade to profile due to foreign key)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(id)

    if (deleteAuthError) {
      console.error("Error deleting user from auth:", deleteAuthError)
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    console.error("Error in customer DELETE API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
