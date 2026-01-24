import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    const { data: properties, error } = await supabase
      .from("real_estate_properties")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
    }

    return NextResponse.json({ properties: properties || [] })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, property_type, address, city, state, country, price_per_night, bedrooms, bathrooms, features, images } = body

    if (!title || !property_type || !address) {
      return NextResponse.json({ error: "Title, property type, and address are required" }, { status: 400 })
    }

    const { data: property, error } = await supabase
      .from("real_estate_properties")
      .insert([
        {
          title,
          description: description || "",
          property_type,
          address,
          city: city || "",
          state: state || "",
          country: country || "",
          price_per_night: price_per_night || 0,
          bedrooms: bedrooms || 1,
          bathrooms: bathrooms || 1,
          features: features || [],
          images: images || [],
          is_available: true,
          is_featured: false,
          status: "active",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[TEST] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
