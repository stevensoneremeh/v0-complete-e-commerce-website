import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

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
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    })

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    let query = supabase
      .from("real_estate_bookings")
      .select(`
        *,
        real_estate_properties (
          product_id,
          products (
            name,
            images
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: bookings, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error in bookings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    })

    const body = await request.json()
    const {
      property_id,
      user_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in_date,
      check_out_date,
      guests,
      nights,
      price_per_night,
      total_amount,
      special_requests,
    } = body

    // Generate booking reference
    const booking_reference = `BK${Date.now()}`

    const { data: booking, error } = await supabase
      .from("real_estate_bookings")
      .insert({
        property_id,
        user_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in_date,
        check_out_date,
        guests,
        nights,
        price_per_night,
        total_amount,
        special_requests,
        booking_reference,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error("Error in booking creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
