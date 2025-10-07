import { NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET() {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: orders, error: ordersError } = await supabase.from("orders").select("*")

    const { data: products, error: productsError } = await supabase.from("products").select("*")

    const { data: customers, error: customersError } = await supabase.from("profiles").select("*")

    if (ordersError || productsError || customersError) {
      console.error("Error fetching analytics data:", {
        ordersError,
        productsError,
        customersError,
      })
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
    }

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

    const recentOrders = orders?.filter(order => new Date(order.created_at) > lastMonth) || []
    const oldOrders = orders?.filter(order => new Date(order.created_at) <= lastMonth) || []

    const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const oldRevenue = oldOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

    const revenueGrowth = oldRevenue > 0 ? ((recentRevenue - oldRevenue) / oldRevenue) * 100 : 0

    const orderGrowth = oldOrders.length > 0 ? ((recentOrders.length - oldOrders.length) / oldOrders.length) * 100 : 0

    const recentCustomers = customers?.filter(customer => new Date(customer.created_at) > lastMonth) || []
    const customerGrowth =
      (customers?.length || 0) - recentCustomers.length > 0
        ? (recentCustomers.length / ((customers?.length || 0) - recentCustomers.length)) * 100
        : 0

    const { data: orderItems } = await supabase.from("order_items").select("product_id, quantity")

    const productSales: Record<string, number> = {}
    orderItems?.forEach((item) => {
      if (item.product_id) {
        productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity
      }
    })

    const topProducts =
      products
        ?.map((product) => ({
          id: product.id,
          name: product.name,
          sales: productSales[product.id] || 0,
          revenue: (productSales[product.id] || 0) * (product.price || 0),
        }))
        .sort((a, b) => b.sales - b.sales)
        .slice(0, 5) || []

    const salesData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const dayOrders = orders?.filter((order) => {
        const orderDate = new Date(order.created_at)
        return orderDate.toDateString() === date.toDateString()
      })
      return {
        date: date.toISOString().split("T")[0],
        revenue: dayOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
        orders: dayOrders?.length || 0,
      }
    })

    const { data: categories } = await supabase.from("categories").select("id, name")

    const categoryStats =
      categories?.map((category) => {
        const categoryProducts = products?.filter((p) => p.category_id === category.id) || []
        const sales = categoryProducts.reduce((sum, product) => {
          return sum + (productSales[product.id] || 0)
        }, 0)
        return {
          name: category.name,
          products: categoryProducts.length,
          sales,
        }
      }) || []

    const analytics = {
      totalRevenue,
      totalOrders: orders?.length || 0,
      totalCustomers: customers?.length || 0,
      totalProducts: products?.length || 0,
      revenueGrowth: Number(revenueGrowth.toFixed(1)),
      orderGrowth: Number(orderGrowth.toFixed(1)),
      customerGrowth: Number(customerGrowth.toFixed(1)),
      productGrowth: 0,
      topProducts,
      salesData,
      categoryStats,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error in analytics API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
