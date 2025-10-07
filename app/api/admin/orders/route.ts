import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    let query = supabase.from("orders").select(`
        id,
        order_number,
        user_id,
        guest_id,
        status,
        payment_status,
        payment_method,
        payment_reference,
        subtotal,
        tax_amount,
        shipping_amount,
        total_amount,
        currency,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_postal_code,
        notes,
        created_at,
        updated_at,
        order_items (
          id,
          order_id,
          product_id,
          quantity,
          unit_price,
          total_price,
          product_name,
          products (
            name,
            images
          )
        )
      `)

    const { data: orders, error: dbError } = await query.order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching orders:", dbError)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    // Format orders with customer info
    const formattedOrders = orders.map(order => ({
      ...order,
      customer_name: order.shipping_name,
      customer_email: order.shipping_email,
      total: order.total_amount,
      order_items: order.order_items?.map((item: any) => ({
        ...item,
        product_name: item.products?.name || item.product_name,
        price: item.unit_price
      }))
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
