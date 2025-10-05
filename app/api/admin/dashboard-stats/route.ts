
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
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
      },
    )

    // Get current month stats
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Fetch all data in parallel
    const [ordersResult, productsResult, customersResult, bookingsResult] = await Promise.all([
      supabase.from("orders").select("total_amount, created_at, status"),
      supabase.from("products").select("id, stock_quantity"),
      supabase.from("profiles").select("id, created_at"),
      supabase.from("real_estate_bookings").select("total_amount, status"),
    ])

    const orders = ordersResult.data || []
    const products = productsResult.data || []
    const customers = customersResult.data || []
    const bookings = bookingsResult.data || []

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const totalBookingRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0)
    const combinedRevenue = totalRevenue + totalBookingRevenue

    const currentMonthOrders = orders.filter(o => new Date(o.created_at) >= firstDayOfMonth)
    const lastMonthOrders = orders.filter(o => {
      const date = new Date(o.created_at)
      return date >= lastMonth && date < firstDayOfMonth
    })

    const revenueChange = lastMonthOrders.length > 0
      ? ((currentMonthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0) - 
          lastMonthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)) / 
          lastMonthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 1)) * 100
      : 0

    const lowStockProducts = products.filter(p => p.stock_quantity < 10)
    const pendingOrders = orders.filter(o => o.status === "pending")
    const processingOrders = orders.filter(o => o.status === "processing")

    return NextResponse.json({
      revenue: combinedRevenue,
      orders: orders.length,
      products: products.length,
      customers: customers.length,
      revenueChange: Number(revenueChange.toFixed(1)),
      ordersChange: lastMonthOrders.length > 0 
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
        : 0,
      lowStockCount: lowStockProducts.length,
      pendingOrdersCount: pendingOrders.length,
      processingOrdersCount: processingOrders.length,
      bookingsCount: bookings.length,
      activeBookings: bookings.filter(b => b.status === "confirmed").length,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
