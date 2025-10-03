import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
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
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      },
    )

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
          price,
          products (
            name,
            price,
            images
          )
        )
      `)

    const { data: orders, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    // Format orders with customer info
    const formattedOrders = orders.map(order => ({
      ...order,
      customer_name: order.profiles?.full_name,
      customer_email: order.profiles?.email || order.customer_email,
      order_items: order.order_items?.map((item: any) => ({
        ...item,
        product_name: item.products?.name || item.product_name
      }))
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
