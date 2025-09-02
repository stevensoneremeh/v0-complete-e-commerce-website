"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"

interface Coupon {
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  description: string
  expiryDate: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
}

interface CouponState {
  appliedCoupon: Coupon | null
  availableCoupons: Coupon[]
}

type CouponAction =
  | { type: "APPLY_COUPON"; payload: Coupon }
  | { type: "REMOVE_COUPON" }
  | { type: "USE_COUPON"; payload: string }
  | { type: "SYNC_COUPONS"; payload: Coupon[] }

const CouponContext = createContext<{
  state: CouponState
  dispatch: React.Dispatch<CouponAction>
  applyCoupon: (code: string) => { success: boolean; message: string; coupon?: Coupon }
  removeCoupon: () => void
  calculateDiscount: (subtotal: number) => number
  appliedCoupon: Coupon | null
} | null>(null)

// Get coupons from admin panel or use defaults
const getCouponsFromStorage = (): Coupon[] => {
  if (typeof window === "undefined") return []

  const adminCoupons = localStorage.getItem("admin_coupons")
  if (adminCoupons) {
    return JSON.parse(adminCoupons)
  }

  // Fallback to default coupons if admin hasn't set any
  return [
    {
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minOrderAmount: 50,
      description: "10% off on orders above $50",
      expiryDate: "2024-12-31",
      isActive: true,
      usageLimit: 100,
      usedCount: 25,
    },
    {
      code: "SAVE20",
      type: "fixed",
      value: 20,
      minOrderAmount: 100,
      description: "$20 off on orders above $100",
      expiryDate: "2024-12-31",
      isActive: true,
      usageLimit: 50,
      usedCount: 12,
    },
    {
      code: "BIGDEAL",
      type: "percentage",
      value: 25,
      minOrderAmount: 200,
      maxDiscount: 50,
      description: "25% off (max $50) on orders above $200",
      expiryDate: "2024-12-31",
      isActive: true,
      usageLimit: 20,
      usedCount: 5,
    },
    {
      code: "FREESHIP",
      type: "fixed",
      value: 5.99,
      description: "Free shipping on any order",
      expiryDate: "2024-12-31",
      isActive: true,
      usageLimit: 200,
      usedCount: 89,
    },
    {
      code: "STUDENT15",
      type: "percentage",
      value: 15,
      minOrderAmount: 75,
      description: "15% student discount on orders above $75",
      expiryDate: "2024-12-31",
      isActive: true,
      usageLimit: 75,
      usedCount: 33,
    },
  ]
}

function couponReducer(state: CouponState, action: CouponAction): CouponState {
  switch (action.type) {
    case "APPLY_COUPON":
      return {
        ...state,
        appliedCoupon: action.payload,
      }
    case "REMOVE_COUPON":
      return {
        ...state,
        appliedCoupon: null,
      }
    case "USE_COUPON":
      return {
        ...state,
        availableCoupons: state.availableCoupons.map((coupon) =>
          coupon.code === action.payload ? { ...coupon, usedCount: coupon.usedCount + 1 } : coupon,
        ),
        appliedCoupon: null,
      }
    case "SYNC_COUPONS":
      return {
        ...state,
        availableCoupons: action.payload,
      }
    default:
      return state
  }
}

export function CouponProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(couponReducer, {
    appliedCoupon: null,
    availableCoupons: getCouponsFromStorage(),
  })

  // Sync with admin panel changes
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCoupons = getCouponsFromStorage()
      dispatch({ type: "SYNC_COUPONS", payload: updatedCoupons })
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const applyCoupon = (code: string, subtotal = 0) => {
    const coupon = state.availableCoupons.find((c) => c.code.toLowerCase() === code.toLowerCase())

    if (!coupon) {
      return { success: false, message: "Invalid coupon code" }
    }

    if (!coupon.isActive) {
      return { success: false, message: "This coupon has expired" }
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return { success: false, message: "This coupon has expired" }
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, message: "This coupon has reached its usage limit" }
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of $${coupon.minOrderAmount} required`,
      }
    }

    dispatch({ type: "APPLY_COUPON", payload: coupon })
    return {
      success: true,
      message: `Coupon applied! ${coupon.description}`,
      coupon,
    }
  }

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" })
  }

  const calculateDiscount = (subtotal: number) => {
    if (!state.appliedCoupon) return 0

    const coupon = state.appliedCoupon
    let discount = 0

    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
    } else {
      discount = coupon.value
    }

    return Math.min(discount, subtotal)
  }

  const useCoupon = (code: string) => {
    dispatch({ type: "USE_COUPON", payload: code })
  }

  return (
    <CouponContext.Provider
      value={{
        state,
        dispatch,
        applyCoupon: (code: string) => applyCoupon(code),
        removeCoupon,
        calculateDiscount,
        appliedCoupon: state.appliedCoupon,
      }}
    >
      {children}
    </CouponContext.Provider>
  )
}

export function useCoupon() {
  const context = useContext(CouponContext)
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider")
  }
  return context
}
