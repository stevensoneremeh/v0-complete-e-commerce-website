import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    // Get hire services
    const { data: services, error: dbError } = await supabase
      .from("hire_services")
      .select("*")
      .order("service_type", { ascending: true })
      .order("sort_order", { ascending: true })

    if (dbError) {
      console.error("Error fetching hire services:", dbError)
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Error in hire services API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const body = await request.json()

    // Create new hire service
    const { data: service, error: dbError } = await supabase
      .from("hire_services")
      .insert([
        {
          ...body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("Error creating hire service:", dbError)
      return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error in hire services POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
