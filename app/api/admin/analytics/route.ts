import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { verifyAdmin } from "../auth/middleware"

export async function GET(request: NextRequest): Promise<NextResponse> {
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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30" // days

    // Get date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(period))

    // Get orders analytics
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("total_amount, status, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (ordersError) {
      console.error("Error fetching orders analytics:", ordersError)
      return NextResponse.json({ error: "Failed to fetch orders analytics" }, { status: 500 })
    }

    // Get products analytics
    const { data: products, error: productsError } = await supabase.from("products").select("id, name, status")

    if (productsError) {
      console.error("Error fetching products analytics:", productsError)
      return NextResponse.json({ error: "Failed to fetch products analytics" }, { status: 500 })
    }

    // Get customers analytics
    const { data: customers, error: customersError } = await supabase
      .from("profiles")
      .select("id, created_at")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (customersError) {
      console.error("Error fetching customers analytics:", customersError)
      return NextResponse.json({ error: "Failed to fetch customers analytics" }, { status: 500 })
    }

    // Calculate analytics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalOrders = orders?.length || 0
    const completedOrders = orders?.filter((order) => order.status === "delivered").length || 0
    const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
    const totalProducts = products?.length || 0
    const activeProducts = products?.filter((product) => product.status === "active").length || 0
    const newCustomers = customers?.length || 0

    // Calculate daily revenue for chart
    const dailyRevenue = []
    for (let i = Number.parseInt(period) - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayOrders =
        orders?.filter((order) => {
          const orderDate = new Date(order.created_at)
          return orderDate >= dayStart && orderDate <= dayEnd
        }) || []

      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

      dailyRevenue.push({
        date: dayStart.toISOString().split("T")[0],
        revenue: dayRevenue,
        orders: dayOrders.length,
      })
    }

    const analytics = {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalProducts,
      activeProducts,
      newCustomers,
      dailyRevenue,
      period: Number.parseInt(period),
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error in analytics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
