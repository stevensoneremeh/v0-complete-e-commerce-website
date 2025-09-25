import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (with fallback to hardcoded email)
    let isAdmin = false
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_admin")
        .eq("id", user.id)
        .single()

      if (profile && !profileError) {
        isAdmin = profile.is_admin || profile.role === "admin" || profile.role === "super_admin"
      }
    } catch (error) {
      console.log("Profile check failed in analytics API, using fallback:", error)
    }

    // Fallback to hardcoded email check if profile lookup fails
    if (!isAdmin) {
      isAdmin = user.email === "talktostevenson@gmail.com"
    }

    if (!isAdmin) {
      return NextResponse.json({ 
        error: "Forbidden - Admin access required",
        userEmail: user.email 
      }, { status: 403 })
    }

    // Get analytics data
    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get("period") || "30")

    const periodDate = new Date()
    periodDate.setDate(periodDate.getDate() - period)

    // Get orders data
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", periodDate.toISOString())

    if (ordersError) {
      return NextResponse.json({ error: "Failed to fetch orders data" }, { status: 500 })
    }

    // Get products count
    const { count: productsCount, error: productsError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    if (productsError) {
      return NextResponse.json({ error: "Failed to fetch products count" }, { status: 500 })
    }

    // Get customers count
    const { count: customersCount, error: customersError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (customersError) {
      return NextResponse.json({ error: "Failed to fetch customers count" }, { status: 500 })
    }

    // Get property data
    const { count: propertiesCount, error: propertiesError } = await supabase
      .from("real_estate_properties")
      .select("*", { count: "exact", head: true })

    // Get bookings data
    const { count: bookingsCount, error: bookingsError } = await supabase
      .from("real_estate_bookings")
      .select("*", { count: "exact", head: true })

    // Calculate analytics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalOrders = orders?.length || 0
    const completedOrders = orders?.filter(order => order.status === "completed").length || 0
    const pendingOrders = orders?.filter(order => order.status === "pending").length || 0
    const activeOrders = orders?.filter(order => order.status === "processing" || order.status === "shipped").length || 0

    // Calculate Paystack-specific metrics
    const paystackOrders = orders?.filter(order => order.payment_method === "paystack") || []
    const paystackRevenue = paystackOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const successfulPayments = paystackOrders.filter(order => order.payment_status === "completed").length
    const failedPayments = paystackOrders.filter(order => order.payment_status === "failed").length
    
    // Calculate growth rate (mock for now - would need historical data)
    const monthlyGrowth = 12.5

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      activeOrders,
      totalProducts: productsCount || 0,
      totalCustomers: customersCount || 0,
      totalProperties: propertiesCount || 0,
      totalBookings: bookingsCount || 0,
      paystackRevenue,
      successfulPayments,
      failedPayments,
      monthlyGrowth,
      recentOrders: orders?.slice(0, 10) || [],
      period
    })

  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
