import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/supabase-server-secure"

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { id } = params

    const { data: item, error } = await supabase.from("hire_items").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching hire item:", error)
      return NextResponse.json({ error: "Hire item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { id } = params
    const itemData = await request.json()

    delete itemData.id
    delete itemData.created_at
    delete itemData.updated_at

    if (itemData.name && !itemData.slug) {
      itemData.slug = itemData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    const { data: item, error } = await supabase.from("hire_items").update(itemData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating hire item:", error)
      return NextResponse.json({ error: "Failed to update hire item" }, { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { id } = params
    const updates = await request.json()

    const { data: item, error } = await supabase.from("hire_items").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating hire item:", error)
      return NextResponse.json({ error: "Failed to update hire item" }, { status: 500 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { id } = params

    const { error } = await supabase.from("hire_items").delete().eq("id", id)

    if (error) {
      console.error("Error deleting hire item:", error)
      return NextResponse.json({ error: "Failed to delete hire item" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
