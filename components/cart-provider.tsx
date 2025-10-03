"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  sku?: string
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  items: CartItem[]
  total: number
  itemCount: number
  isInCart: (id: string) => boolean
  getItemQuantity: (id: string) => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        const maxQuantity = action.payload.maxQuantity || 99
        if (newQuantity > maxQuantity) {
          return state // Don't add if exceeds max quantity
        }

        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: newQuantity } : item,
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }]
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      }
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => {
          if (item.id === action.payload.id) {
            const maxQuantity = item.maxQuantity || 99
            const newQuantity = Math.min(action.payload.quantity, maxQuantity)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }
    case "CLEAR_CART":
      return { items: [], total: 0 }
    case "LOAD_CART":
      return action.payload
    default:
      return state
  }
}

const CART_STORAGE_KEY = "abl-natasha-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsHydrated(true)
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [cartItems, isHydrated])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1
        const maxQuantity = item.maxQuantity || 99
        if (newQuantity > maxQuantity) {
          return prevItems
        }
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem,
        )
      } else {
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== id)
      }
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 99) } : item,
      )
    })
  }

  const clearCart = () => {
    setCartItems([])
  }

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const isInCart = (id: string) => {
    return cartItems.some((item) => item.id === id)
  }

  const getItemQuantity = (id: string) => {
    const item = cartItems.find((item) => item.id === id)
    return item ? item.quantity : 0
  }

  const value = {
    items: isHydrated ? cartItems : [],
    itemCount: isHydrated ? itemCount : 0,
    totalAmount: isHydrated ? totalAmount : 0,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    isInCart,
    getItemQuantity,
  }

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
