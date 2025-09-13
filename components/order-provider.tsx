"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/components/auth-provider"
import { createOrderClient, getUserOrdersClient } from "@/lib/orders"
import type { Order, CreateOrderData } from "@/lib/orders"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface LegacyOrder {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: OrderItem[]
  tracking?: string | null
  estimatedDelivery?: string | null
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  paymentReference?: string
  couponCode?: string
  discount?: number
  cancelReason?: string
  cancelDate?: string
}

interface OrderState {
  orders: LegacyOrder[]
  isLoading: boolean
}

const OrderContext = createContext<{
  state: OrderState
  addOrder: (order: Omit<LegacyOrder, "id" | "date">) => Promise<string>
  cancelOrder: (orderId: string, reason: string) => boolean
  deleteOrder: (orderId: string) => boolean
  updateOrderStatus: (orderId: string, status: LegacyOrder["status"], tracking?: string) => boolean
  getOrder: (orderId: string) => LegacyOrder | undefined
  getUserOrders: () => LegacyOrder[]
  canCancelOrder: (order: LegacyOrder) => boolean
  canDeleteOrder: (order: LegacyOrder) => boolean
  refreshOrders: () => Promise<void>
  createDatabaseOrder: (orderData: CreateOrderData) => Promise<{ orderId: string | null; error: string | null }>
} | null>(null)

const convertDatabaseOrderToLegacy = (dbOrder: Order): LegacyOrder => {
  return {
    id: dbOrder.order_number,
    date: new Date(dbOrder.created_at).toISOString().split("T")[0],
    status: dbOrder.status === "pending" ? "processing" : dbOrder.status,
    total: dbOrder.total_amount,
    items: dbOrder.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    tracking: dbOrder.tracking_number || null,
    estimatedDelivery: dbOrder.shipped_at
      ? new Date(new Date(dbOrder.shipped_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : null,
    shippingAddress: {
      firstName: dbOrder.shipping_name.split(" ")[0] || "",
      lastName: dbOrder.shipping_name.split(" ").slice(1).join(" ") || "",
      address: dbOrder.shipping_address,
      city: dbOrder.shipping_city,
      state: "", // Not stored separately in database
      zipCode: dbOrder.shipping_postal_code,
      country: dbOrder.shipping_country,
    },
    paymentMethod: dbOrder.payment_method,
    paymentReference: dbOrder.payment_reference,
  }
}

// Mock orders data for fallback
const initialOrders: LegacyOrder[] = [
  {
    id: "#3210",
    date: "2024-01-15",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: "1",
        name: "Wireless Headphones Pro",
        price: 99.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: "2",
        name: "Phone Case",
        price: 29.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    tracking: "1Z999AA1234567890",
    estimatedDelivery: "2024-01-18",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    paymentReference: "PAY123456",
  },
]

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, setState] = useState<OrderState>({
    orders: initialOrders,
    isLoading: false,
  })

  const refreshOrders = async () => {
    if (!user?.id) {
      setState((prev) => ({ ...prev, orders: initialOrders }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const dbOrders = await getUserOrdersClient(user.id)
      const legacyOrders = dbOrders.map(convertDatabaseOrderToLegacy)
      setState((prev) => ({
        ...prev,
        orders: legacyOrders.length > 0 ? legacyOrders : initialOrders,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error loading orders:", error)
      setState((prev) => ({ ...prev, orders: initialOrders, isLoading: false }))
    }
  }

  useEffect(() => {
    refreshOrders()
  }, [user?.id])

  const createDatabaseOrder = async (
    orderData: CreateOrderData,
  ): Promise<{ orderId: string | null; error: string | null }> => {
    try {
      const { order, error } = await createOrderClient(orderData)
      if (error || !order) {
        return { orderId: null, error: error || "Failed to create order" }
      }

      // Refresh orders to include the new one
      await refreshOrders()

      return { orderId: order.order_number, error: null }
    } catch (error) {
      console.error("Error creating database order:", error)
      return { orderId: null, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  const addOrder = async (orderData: Omit<LegacyOrder, "id" | "date">): Promise<string> => {
    const orderId = `#${Date.now().toString().slice(-4)}`
    const order: LegacyOrder = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString().split("T")[0],
    }
    setState((prev) => ({
      ...prev,
      orders: [order, ...prev.orders],
    }))
    return orderId
  }

  const cancelOrder = (orderId: string, reason: string) => {
    const order = state.orders.find((o) => o.id === orderId)
    if (!order || !canCancelOrder(order)) {
      return false
    }

    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "cancelled" as const,
              cancelReason: reason,
              cancelDate: new Date().toISOString().split("T")[0],
            }
          : order,
      ),
    }))
    return true
  }

  const deleteOrder = (orderId: string) => {
    const order = state.orders.find((o) => o.id === orderId)
    if (!order || !canDeleteOrder(order)) {
      return false
    }

    setState((prev) => ({
      ...prev,
      orders: prev.orders.filter((order) => order.id !== orderId),
    }))
    return true
  }

  const updateOrderStatusLocal = (orderId: string, status: LegacyOrder["status"], tracking?: string) => {
    const order = state.orders.find((o) => o.id === orderId)
    if (!order) {
      return false
    }

    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: status,
              tracking: tracking || order.tracking,
            }
          : order,
      ),
    }))
    return true
  }

  const getOrder = (orderId: string) => {
    return state.orders.find((order) => order.id === orderId)
  }

  const getUserOrders = () => {
    return state.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const canCancelOrder = (order: LegacyOrder) => {
    return order.status === "processing"
  }

  const canDeleteOrder = (order: LegacyOrder) => {
    return order.status === "cancelled"
  }

  return (
    <OrderContext.Provider
      value={{
        state,
        addOrder,
        cancelOrder,
        deleteOrder,
        updateOrderStatus: updateOrderStatusLocal,
        getOrder,
        getUserOrders,
        canCancelOrder,
        canDeleteOrder,
        refreshOrders,
        createDatabaseOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}
