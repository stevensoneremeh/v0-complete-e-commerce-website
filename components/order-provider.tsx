"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
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
  orders: Order[]
}

type OrderAction =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "CANCEL_ORDER"; payload: { orderId: string; reason: string } }
  | { type: "DELETE_ORDER"; payload: string }
  | { type: "UPDATE_ORDER_STATUS"; payload: { orderId: string; status: Order["status"]; tracking?: string } }

const OrderContext = createContext<{
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
  addOrder: (order: Omit<Order, "id" | "date">) => string
  cancelOrder: (orderId: string, reason: string) => boolean
  deleteOrder: (orderId: string) => boolean
  updateOrderStatus: (orderId: string, status: Order["status"], tracking?: string) => boolean
  getOrder: (orderId: string) => Order | undefined
  getUserOrders: () => Order[]
  canCancelOrder: (order: Order) => boolean
  canDeleteOrder: (order: Order) => boolean
} | null>(null)

// Mock orders data
const initialOrders: Order[] = [
  {
    id: "#3210",
    date: "2024-01-15",
    status: "delivered",
    total: 129.99,
    items: [
      {
        id: 1,
        name: "Wireless Headphones Pro",
        price: 99.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
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
  {
    id: "#3209",
    date: "2024-01-10",
    status: "shipped",
    total: 89.99,
    items: [
      {
        id: 3,
        name: "Smart Fitness Watch",
        price: 89.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    tracking: "1Z999AA1234567891",
    estimatedDelivery: "2024-01-20",
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
    paymentReference: "PAY123457",
  },
  {
    id: "#3208",
    date: "2024-01-05",
    status: "processing",
    total: 199.99,
    items: [
      {
        id: 4,
        name: "Premium Laptop Backpack",
        price: 49.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        name: "Bluetooth Speaker",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        name: "USB Cable",
        price: 19.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    tracking: null,
    estimatedDelivery: "2024-01-25",
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
    paymentReference: "PAY123458",
  },
  {
    id: "#3207",
    date: "2024-01-01",
    status: "cancelled",
    total: 59.99,
    items: [
      {
        id: 7,
        name: "Wireless Mouse",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
    tracking: null,
    estimatedDelivery: null,
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
    paymentReference: "PAY123459",
    cancelReason: "Changed my mind",
    cancelDate: "2024-01-02",
  },
]

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "ADD_ORDER": {
      return {
        orders: [action.payload, ...state.orders],
      }
    }
    case "CANCEL_ORDER": {
      return {
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? {
                ...order,
                status: "cancelled" as const,
                cancelReason: action.payload.reason,
                cancelDate: new Date().toISOString().split("T")[0],
              }
            : order,
        ),
      }
    }
    case "DELETE_ORDER": {
      return {
        orders: state.orders.filter((order) => order.id !== action.payload),
      }
    }
    case "UPDATE_ORDER_STATUS": {
      return {
        orders: state.orders.map((order) =>
          order.id === action.payload.orderId
            ? {
                ...order,
                status: action.payload.status,
                tracking: action.payload.tracking || order.tracking,
              }
            : order,
        ),
      }
    }
    default:
      return state
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, { orders: initialOrders })

  const addOrder = (orderData: Omit<Order, "id" | "date">) => {
    const orderId = `#${Date.now().toString().slice(-4)}`
    const order: Order = {
      ...orderData,
      id: orderId,
      date: new Date().toISOString().split("T")[0],
    }
    dispatch({ type: "ADD_ORDER", payload: order })
    return orderId
  }

  const cancelOrder = (orderId: string, reason: string) => {
    const order = state.orders.find((o) => o.id === orderId)
    if (!order || !canCancelOrder(order)) {
      return false
    }
    dispatch({ type: "CANCEL_ORDER", payload: { orderId, reason } })
    return true
  }

  const deleteOrder = (orderId: string) => {
    const order = state.orders.find((o) => o.id === orderId)
    if (!order || !canDeleteOrder(order)) {
      return false
    }
    dispatch({ type: "DELETE_ORDER", payload: orderId })
    return true
  }

  const updateOrderStatus = (orderId: string, status: Order["status"], tracking?: string) => {
    const order = state.orders.find((o) => o.id === orderId)
    if (!order) {
      return false
    }
    dispatch({ type: "UPDATE_ORDER_STATUS", payload: { orderId, status, tracking } })
    return true
  }

  const getOrder = (orderId: string) => {
    return state.orders.find((order) => order.id === orderId)
  }

  const getUserOrders = () => {
    return state.orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const canCancelOrder = (order: Order) => {
    return order.status === "processing"
  }

  const canDeleteOrder = (order: Order) => {
    return order.status === "cancelled"
  }

  return (
    <OrderContext.Provider
      value={{
        state,
        dispatch,
        addOrder,
        cancelOrder,
        deleteOrder,
        updateOrderStatus,
        getOrder,
        getUserOrders,
        canCancelOrder,
        canDeleteOrder,
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
