import { type NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient, verifyAdmin } from "@/lib/supabase-server-secure"

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get("service_type")

    let query = supabase
      .from("hire_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (serviceType) {
      query = query.eq("service_type", serviceType)
    }

    const { data: hireItems, error } = await query

    if (error) {
      console.error("Error fetching hire items:", error)
      return NextResponse.json({ error: "Failed to fetch hire items" }, { status: 500 })
    }

    return NextResponse.json(hireItems || [])
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const itemData = await request.json()

    if (!itemData.slug) {
      itemData.slug = itemData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    const { data: item, error } = await supabase
      .from("hire_items")
      .insert([itemData])
      .select()
      .single()

    if (error) {
      console.error("Error creating hire item:", error)
      return NextResponse.json({ error: "Failed to create hire item" }, { status: 500 })
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
