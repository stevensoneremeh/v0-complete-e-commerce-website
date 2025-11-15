import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const cookieStore = await cookies()
    // const supabase = createServerClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    //   {
    //     cookies: {
    //       getAll() {
    //         return cookieStore.getAll()
    //       },
    //       setAll(cookiesToSet) {
    //         cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
    //       },
    //     },
    //   },
    // )

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    if (range === "7d") startDate.setDate(now.getDate() - 7)
    else if (range === "30d") startDate.setDate(now.getDate() - 30)
    else if (range === "90d") startDate.setDate(now.getDate() - 90)

    // Fetch dashboard statistics
    const [ordersRes, customersRes, productsRes, categoriesRes] = await Promise.all([
      supabase.from("orders").select("*").gte("created_at", startDate.toISOString()),
      supabase.from("profiles").select("id, created_at"),
      supabase.from("products").select("*"),
      supabase.from("categories").select("*"),
    ])

    const orders = ordersRes.data || []
    const customers = customersRes.data || []
    const products = productsRes.data || []

    // Calculate metrics
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalCustomers = customers.length
    const totalProducts = products.length
    const pendingOrders = orders.filter((o) => o.status === "pending").length
    const lowStockProducts = products.filter((p) => p.stock_quantity < 10).length

    // Generate sales data for chart
    const salesData = generateSalesData(orders, range)
    const orderStatusData = generateOrderStatusData(orders)
    const topProducts = generateTopProducts(orders, products)
    const recentOrders = orders.slice(-5).reverse()

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      lowStockProducts,
      salesData,
      orderStatusData,
      topProducts,
      recentOrders,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

function generateSalesData(orders: any[], range: string) {
  const data: Record<string, any> = {}
  const now = new Date()

  orders.forEach((order) => {
    const date = new Date(order.created_at).toLocaleDateString()
    if (!data[date]) {
      data[date] = { date, sales: 0, orders: 0 }
    }
    data[date].sales += order.total || 0
    data[date].orders += 1
  })

  return Object.values(data).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function generateOrderStatusData(orders: any[]) {
  const statusCounts: Record<string, number> = {}

  orders.forEach((order) => {
    const status = order.status || "unknown"
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })

  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
}

function generateTopProducts(orders: any[], products: any[]) {
  const productSales: Record<string, any> = {}

  orders.forEach((order) => {
    const items = order.items || []
    items.forEach((item: any) => {
      if (!productSales[item.product_id]) {
        const product = products.find((p) => p.id === item.product_id)
        productSales[item.product_id] = {
          id: item.product_id,
          name: product?.name || "Unknown",
          sales: 0,
          revenue: 0,
        }
      }
      productSales[item.product_id].sales += item.quantity || 1
      productSales[item.product_id].revenue += item.price * (item.quantity || 1)
    })
  })

  return Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
}
