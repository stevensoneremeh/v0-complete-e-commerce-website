import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  product_id: string
  product_sku?: string
}

export interface Order {
  id: string
  order_number: string
  user_id?: string
  guest_id?: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method: string
  payment_reference?: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  currency: string
  items: OrderItem[]
  shipping_name: string
  shipping_email: string
  shipping_phone?: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal_code: string
  billing_name: string
  billing_email: string
  billing_phone?: string
  billing_address: string
  billing_city: string
  billing_country: string
  billing_postal_code: string
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string
}

export interface CreateOrderData {
  user_id?: string
  guest_id?: string
  items: Array<{
    product_id: string
    product_name: string
    product_sku?: string
    quantity: number
    unit_price: number
  }>
  subtotal: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  currency: string
  payment_method: string
  payment_reference?: string
  shipping_name: string
  shipping_email: string
  shipping_phone?: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal_code: string
  billing_name: string
  billing_email: string
  billing_phone?: string
  billing_address: string
  billing_city: string
  billing_country: string
  billing_postal_code: string
  notes?: string
}

// Server-side functions
export async function createOrder(orderData: CreateOrderData): Promise<{ order: Order | null; error: string | null }> {
  try {
    const supabase = await createClient()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: orderData.user_id,
        guest_id: orderData.guest_id,
        status: "pending",
        payment_status: "pending",
        payment_method: orderData.payment_method,
        payment_reference: orderData.payment_reference,
        subtotal: orderData.subtotal,
        tax_amount: orderData.tax_amount,
        shipping_amount: orderData.shipping_amount,
        total_amount: orderData.total_amount,
        currency: orderData.currency,
        shipping_name: orderData.shipping_name,
        shipping_email: orderData.shipping_email,
        shipping_phone: orderData.shipping_phone,
        shipping_address: orderData.shipping_address,
        shipping_city: orderData.shipping_city,
        shipping_country: orderData.shipping_country,
        shipping_postal_code: orderData.shipping_postal_code,
        billing_name: orderData.billing_name,
        billing_email: orderData.billing_email,
        billing_phone: orderData.billing_phone,
        billing_address: orderData.billing_address,
        billing_city: orderData.billing_city,
        billing_country: orderData.billing_country,
        billing_postal_code: orderData.billing_postal_code,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { order: null, error: orderError.message }
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to clean up the order if items failed
      await supabase.from("orders").delete().eq("id", order.id)
      return { order: null, error: itemsError.message }
    }

    // Fetch the complete order with items
    const completeOrder = await getOrderById(order.id)
    return { order: completeOrder, error: null }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return { order: null, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = await createClient()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      console.error("Error fetching order:", orderError)
      return null
    }

    // Transform the data to match our Order interface
    const transformedOrder: Order = {
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      guest_id: order.guest_id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      shipping_amount: order.shipping_amount,
      total_amount: order.total_amount,
      currency: order.currency,
      shipping_name: order.shipping_name,
      shipping_email: order.shipping_email,
      shipping_phone: order.shipping_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_country: order.shipping_country,
      shipping_postal_code: order.shipping_postal_code,
      billing_name: order.billing_name,
      billing_email: order.billing_email,
      billing_phone: order.billing_phone,
      billing_address: order.billing_address,
      billing_city: order.billing_city,
      billing_country: order.billing_country,
      billing_postal_code: order.billing_postal_code,
      tracking_number: order.tracking_number,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        image: "/placeholder.svg?height=100&width=100", // You might want to join with products table for actual images
        product_id: item.product_id,
        product_sku: item.product_sku,
      })),
    }

    return transformedOrder
  } catch (error) {
    console.error("Error in getOrderById:", error)
    return null
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user orders:", error)
      return []
    }

    return orders.map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      guest_id: order.guest_id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      shipping_amount: order.shipping_amount,
      total_amount: order.total_amount,
      currency: order.currency,
      shipping_name: order.shipping_name,
      shipping_email: order.shipping_email,
      shipping_phone: order.shipping_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_country: order.shipping_country,
      shipping_postal_code: order.shipping_postal_code,
      billing_name: order.billing_name,
      billing_email: order.billing_email,
      billing_phone: order.billing_phone,
      billing_address: order.billing_address,
      billing_city: order.billing_city,
      billing_country: order.billing_country,
      billing_postal_code: order.billing_postal_code,
      tracking_number: order.tracking_number,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        image: "/placeholder.svg?height=100&width=100",
        product_id: item.product_id,
        product_sku: item.product_sku,
      })),
    }))
  } catch (error) {
    console.error("Error in getUserOrders:", error)
    return []
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  trackingNumber?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (trackingNumber) {
      updateData.tracking_number = trackingNumber
    }

    if (status === "shipped") {
      updateData.shipped_at = new Date().toISOString()
    } else if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString()
    }

    const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

    if (error) {
      console.error("Error updating order status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in updateOrderStatus:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Client-side functions
export async function createOrderClient(
  orderData: CreateOrderData,
): Promise<{ order: Order | null; error: string | null }> {
  try {
    const supabase = createBrowserClient()

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: orderData.user_id,
        guest_id: orderData.guest_id,
        status: "pending",
        payment_status: "pending",
        payment_method: orderData.payment_method,
        payment_reference: orderData.payment_reference,
        subtotal: orderData.subtotal,
        tax_amount: orderData.tax_amount,
        shipping_amount: orderData.shipping_amount,
        total_amount: orderData.total_amount,
        currency: orderData.currency,
        shipping_name: orderData.shipping_name,
        shipping_email: orderData.shipping_email,
        shipping_phone: orderData.shipping_phone,
        shipping_address: orderData.shipping_address,
        shipping_city: orderData.shipping_city,
        shipping_country: orderData.shipping_country,
        shipping_postal_code: orderData.shipping_postal_code,
        billing_name: orderData.billing_name,
        billing_email: orderData.billing_email,
        billing_phone: orderData.billing_phone,
        billing_address: orderData.billing_address,
        billing_city: orderData.billing_city,
        billing_country: orderData.billing_country,
        billing_postal_code: orderData.billing_postal_code,
        notes: orderData.notes,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { order: null, error: orderError.message }
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Try to clean up the order if items failed
      await supabase.from("orders").delete().eq("id", order.id)
      return { order: null, error: itemsError.message }
    }

    // Fetch the complete order with items
    const completeOrder = await getOrderByIdClient(order.id)
    return { order: completeOrder, error: null }
  } catch (error) {
    console.error("Error in createOrderClient:", error)
    return { order: null, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getOrderByIdClient(orderId: string): Promise<Order | null> {
  try {
    const supabase = createBrowserClient()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      console.error("Error fetching order:", orderError)
      return null
    }

    // Transform the data to match our Order interface
    const transformedOrder: Order = {
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      guest_id: order.guest_id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      shipping_amount: order.shipping_amount,
      total_amount: order.total_amount,
      currency: order.currency,
      shipping_name: order.shipping_name,
      shipping_email: order.shipping_email,
      shipping_phone: order.shipping_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_country: order.shipping_country,
      shipping_postal_code: order.shipping_postal_code,
      billing_name: order.billing_name,
      billing_email: order.billing_email,
      billing_phone: order.billing_phone,
      billing_address: order.billing_address,
      billing_city: order.billing_city,
      billing_country: order.billing_country,
      billing_postal_code: order.billing_postal_code,
      tracking_number: order.tracking_number,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        image: "/placeholder.svg?height=100&width=100",
        product_id: item.product_id,
        product_sku: item.product_sku,
      })),
    }

    return transformedOrder
  } catch (error) {
    console.error("Error in getOrderByIdClient:", error)
    return null
  }
}

export async function getUserOrdersClient(userId: string): Promise<Order[]> {
  try {
    const supabase = createBrowserClient()

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user orders:", error)
      return []
    }

    return orders.map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      user_id: order.user_id,
      guest_id: order.guest_id,
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      shipping_amount: order.shipping_amount,
      total_amount: order.total_amount,
      currency: order.currency,
      shipping_name: order.shipping_name,
      shipping_email: order.shipping_email,
      shipping_phone: order.shipping_phone,
      shipping_address: order.shipping_address,
      shipping_city: order.shipping_city,
      shipping_country: order.shipping_country,
      shipping_postal_code: order.shipping_postal_code,
      billing_name: order.billing_name,
      billing_email: order.billing_email,
      billing_phone: order.billing_phone,
      billing_address: order.billing_address,
      billing_city: order.billing_city,
      billing_country: order.billing_country,
      billing_postal_code: order.billing_postal_code,
      tracking_number: order.tracking_number,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        image: "/placeholder.svg?height=100&width=100",
        product_id: item.product_id,
        product_sku: item.product_sku,
      })),
    }))
  } catch (error) {
    console.error("Error in getUserOrdersClient:", error)
    return []
  }
}
