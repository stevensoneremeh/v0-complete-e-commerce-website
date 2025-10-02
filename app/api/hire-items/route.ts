import { type NextRequest, NextResponse } from "next/server"
import { createPublicSupabaseClient } from "@/lib/supabase-server-secure"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createPublicSupabaseClient()

    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get("service_type")

    let query = supabase
      .from("hire_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (serviceType) {
      query = query.eq("service_type", serviceType)
    }

    const { data: hireItems, error } = await query

    if (error) {
      console.error("Error fetching hire items:", error)
      return NextResponse.json({ items: [] }, { status: 200 })
    }

    return NextResponse.json({ items: hireItems || [] })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ items: [] }, { status: 200 })
  }
}
