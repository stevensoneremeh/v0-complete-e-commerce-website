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
    const { data: services, error } = await supabase
      .from("hire_services")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    return NextResponse.json({ services: services || [] })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, service_type, price_per_hour, price_per_day, max_capacity, features, images } = body

    if (!name || !service_type) {
      return NextResponse.json({ error: "Name and service type are required" }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-")

    const { data: service, error } = await supabase
      .from("hire_services")
      .insert([
        {
          name,
          slug,
          description: description || "",
          service_type,
          price_per_hour: price_per_hour || 0,
          price_per_day: price_per_day || 0,
          max_capacity: max_capacity || 1,
          features: features || [],
          images: images || [],
          is_active: true,
          is_available: true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[TEST] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
