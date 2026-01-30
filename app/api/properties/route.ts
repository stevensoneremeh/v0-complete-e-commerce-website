import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: properties, error } = await supabase
      .from("real_estate_properties")
      .select(
        `
        *,
        products (
          id,
          name,
          description,
          images,
          price,
          is_active
        )
      `,
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching public properties:", error)
      return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
    }

    return NextResponse.json({ properties: properties || [] })
  } catch (error) {
    console.error("Error in public properties API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
