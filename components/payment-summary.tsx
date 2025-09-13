"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { ShoppingCart, Truck, Calculator, Percent } from "lucide-react"

interface PaymentSummaryProps {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  subtotal: number
  shipping: number
  tax: number
  discount?: number
  couponCode?: string
  total: number
  currency?: "USD" | "NGN"
  className?: string
}

export function PaymentSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount = 0,
  couponCode,
  total,
  currency = "USD",
  className,
}: PaymentSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Payment Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Items ({itemCount})</span>
            <Badge variant="secondary">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          </div>

          {/* Show first 3 items, then "and X more" */}
          <div className="space-y-2">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex-1 truncate">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                </div>
                <DualCurrencyDisplay
                  usdAmount={item.price * item.quantity}
                  size="sm"
                  variant="default"
                  compact={true}
                />
              </div>
            ))}
            {items.length > 3 && (
              <div className="text-sm text-muted-foreground">
                and {items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Cost Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span>Subtotal</span>
            </div>
            <DualCurrencyDisplay usdAmount={subtotal} size="sm" variant="default" compact={true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Shipping</span>
              {shipping === 0 && (
                <Badge variant="secondary" className="text-xs">
                  FREE
                </Badge>
              )}
            </div>
            <span className="text-sm">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Tax (8%)</span>
            <span className="text-sm">${tax.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4" />
                <span>Discount</span>
                {couponCode && (
                  <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                    {couponCode}
                  </Badge>
                )}
              </div>
              <span className="text-sm font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-lg">
            <span>Total</span>
            <DualCurrencyDisplay usdAmount={total} size="lg" variant="primary" compact={false} className="text-right" />
          </div>

          {discount > 0 && (
            <div className="text-sm text-green-600 text-right font-medium">You save ${discount.toFixed(2)}!</div>
          )}

          {subtotal >= 100 && shipping === 0 && (
            <div className="text-sm text-green-600 text-right">🎉 You qualified for free shipping!</div>
          )}
        </div>

        {/* Payment Security Notice */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Secure payment processing with industry-standard encryption
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
