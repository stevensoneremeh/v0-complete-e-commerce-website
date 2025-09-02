"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Tag, Copy, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getCoupons, type Coupon } from "@/lib/local-storage"

interface CouponBannerProps {
  onClose?: () => void
}

export function CouponBanner({ onClose }: CouponBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadActiveCoupons = () => {
      const allCoupons = getCoupons()
      const now = new Date()
      const activeCoupons = allCoupons
        .filter((coupon) => {
          const expiresAtDate = coupon.expiresAt ? new Date(coupon.expiresAt) : null
          const isExpired = expiresAtDate && expiresAtDate < now
          const isUsageLimitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit
          return coupon.isActive && !isExpired && !isUsageLimitReached
        })
        .slice(0, 3) // Limit to 3 coupons for the banner
      setCoupons(activeCoupons)
    }

    loadActiveCoupons()

    // Listen for storage changes to update coupons in real-time
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "admin_coupons") {
        loadActiveCoupons()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Coupon copied!",
      description: `Coupon code ${code} has been copied to your clipboard.`,
    })
  }

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible || coupons.length === 0) return null

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Special Offers Available!</h3>
            <Badge variant="secondary" className="animate-pulse">
              <Clock className="h-3 w-3 mr-1" />
              Limited Time
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between p-3 bg-background border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {coupon.code}
                  </Badge>
                  <span className="font-semibold text-sm text-primary">
                    {coupon.type === "percentage" ? `${coupon.value}% OFF` : `$${coupon.value.toFixed(2)} OFF`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{coupon.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleCopyCoupon(coupon.code)} className="ml-2">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          Apply these codes at checkout to get instant discounts on your order!
        </p>
      </CardContent>
    </Card>
  )
}
