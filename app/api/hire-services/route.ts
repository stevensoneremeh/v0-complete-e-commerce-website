import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * GET /api/hire-services
 * Public API endpoint for fetching hire services (car hire, boat cruises) on the user-facing side
 * Only returns active services (is_active = true) sorted by service type
 * 
 * Real-time sync: When admins create/update/delete hire services via admin dashboard,
 * changes are immediately visible to users as this queries the same Supabase table
 * and filters by is_active status.
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      },
    )

    const { data: services, error } = await supabase
      .from("hire_services")
      .select("*")
      .eq("is_active", true)
      .order("service_type", { ascending: true })

    if (error) {
      console.error("Error fetching hire services:", error)
      return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
    }

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Error in hire services API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
