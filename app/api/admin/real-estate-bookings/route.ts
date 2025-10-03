import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    })

    const { data: bookings, error } = await supabase
      .from("real_estate_bookings")
      .select(`
        *,
        real_estate_properties (
          title,
          address,
          city,
          state
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching real estate bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error in real estate bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
