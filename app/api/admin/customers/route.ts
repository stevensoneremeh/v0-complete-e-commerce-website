import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    // Get all profiles with order statistics
    const { data: profiles, error: dbError } = await supabase
      .from("profiles")
      .select(`
        *,
        orders:orders(count),
        order_totals:orders(total)
      `)
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching customers:", dbError)
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
    }

    // Calculate total spent for each customer
    const customersWithStats = profiles.map(profile => ({
      ...profile,
      total_orders: profile.orders?.[0]?.count || 0,
      total_spent: profile.order_totals?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0
    }))

    return NextResponse.json(customersWithStats)
  } catch (error) {
    console.error("Error in customers API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const customerData = await request.json()

    // Create user in auth
    const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: customerData.email,
      password: "TempPassword123!", // User should change this
      email_confirm: true
    })

    if (createUserError) {
      console.error("Error creating auth user:", createUserError)
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    // Create profile
    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .insert([{
        id: authUser.user.id,
        email: customerData.email,
        full_name: customerData.full_name,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        country: customerData.country,
        role: customerData.role,
        is_admin: customerData.is_admin
      }])
      .select()
      .single()

    if (dbError) {
      console.error("Error creating profile:", dbError)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error in customers POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
