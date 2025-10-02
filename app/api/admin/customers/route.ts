import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { verifyAdmin } from "../auth/middleware"

export async function GET(request: NextRequest) {
  // Check admin access
  const adminCheck = await verifyAdmin(request)
  if (adminCheck) return adminCheck

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

    // Fetch all real users from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
    }

    // Fetch order statistics for each customer
    const customersWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, status")
          .eq("customer_id", profile.id)

        const totalOrders = orders?.length || 0
        const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

        return {
          id: profile.id,
          name: profile.full_name || profile.email,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          role: profile.role || "customer",
          isAdmin: profile.is_admin || false,
          isActive: profile.is_active !== false,
          totalOrders,
          totalSpent,
          createdAt: profile.created_at,
          lastLogin: profile.last_sign_in_at,
        }
      })
    )

    return NextResponse.json({ customers: customersWithStats })
  } catch (error) {
    console.error("Error in customers route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Check admin access
  const adminCheck = await verifyAdmin(request)
  if (adminCheck) return adminCheck

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

    const customerData = await request.json()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: customerData.email,
      password: customerData.password || Math.random().toString(36).slice(-8),
      email_confirm: true,
      user_metadata: {
        full_name: customerData.name,
      },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    // Update profile with additional information
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        country: customerData.country,
        role: customerData.role || "customer",
        is_admin: customerData.role === "admin",
      })
      .eq("id", authData.user.id)
      .select()
      .single()

    if (profileError) {
      console.error("Error updating profile:", profileError)
    }

    return NextResponse.json({ 
      customer: {
        id: authData.user.id,
        email: authData.user.email,
        name: customerData.name,
        role: customerData.role || "customer",
      }
    })
  } catch (error) {
    console.error("Error in customer creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}