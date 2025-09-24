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

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!profile.is_admin && profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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

    // Calculate analytics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalOrders = orders?.length || 0
    const completedOrders = orders?.filter(order => order.status === "completed").length || 0
    const pendingOrders = orders?.filter(order => order.status === "pending").length || 0

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalProducts: productsCount || 0,
      totalCustomers: customersCount || 0,
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
