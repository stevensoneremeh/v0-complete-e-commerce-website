"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { useCoupon } from "@/components/coupon-provider"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, X, Percent } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart, itemCount } = useCart()
  const { toast } = useToast()
  const { applyCoupon, removeCoupon, calculateDiscount, appliedCoupon } = useCoupon()

  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const shippingCost = total >= 100 ? 0 : 5.99
  const tax = total * 0.08
  const discount = calculateDiscount(total)
  const finalTotal = total + shippingCost + tax - discount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    setIsApplyingCoupon(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = applyCoupon(couponCode)

    if (result.success) {
      toast({
        title: "Coupon applied!",
        description: result.message,
      })
      setCouponCode("")
    } else {
      toast({
        title: "Invalid coupon",
        description: result.message,
        variant: "destructive",
      })
    }

    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your cart.",
    })
  }

  const handleRemoveItem = (item: any) => {
    removeItem(item.id)
    toast({
      title: "Item removed",
      description: `${item.name} has been removed from your cart.`,
      variant: "destructive",
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      variant: "destructive",
    })
  }

  const generateCartWhatsAppMessage = () => {
    let message = "Hello! I'm interested in purchasing the following items:\n\n"

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Price: $${item.price}\n`
      message += `   Quantity: ${item.quantity}\n\n`
    })

    message += `Total: $${finalTotal.toFixed(2)}\n\n`
    message += "Could you please help me complete this purchase or provide more information?"

    return message
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="p-6 rounded-full bg-muted w-fit mx-auto">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
            </div>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/products">Start Shopping</Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                <Link href="/products?category=featured" className="text-primary hover:underline">
                  Browse Featured Products
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <span>Shopping Cart</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleClearCart} className="bg-transparent">
              Clear Cart
            </Button>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href={`/products/${item.id}`} className="flex-shrink-0 mx-auto sm:mx-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 text-center sm:text-left space-y-2">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-semibold text-lg hover:text-primary cursor-pointer transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      {item.sku && <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>}
                      <DualCurrencyDisplay usdAmount={item.price} size="md" variant="primary" compact={false} />
                      {item.maxQuantity && (
                        <Badge variant="secondary" className="text-xs">
                          Max: {item.maxQuantity}
                        </Badge>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 bg-transparent"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = Number.parseInt(e.target.value) || 1
                            const maxQuantity = item.maxQuantity || 99
                            updateQuantity(item.id, Math.min(newQuantity, maxQuantity))
                          }}
                          className="w-16 text-center"
                          min="1"
                          max={item.maxQuantity || 99}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                          className="h-8 w-8 bg-transparent"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-center sm:text-right">
                      <DualCurrencyDisplay
                        usdAmount={item.price * item.quantity}
                        size="lg"
                        variant="primary"
                        compact={false}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Coupon Code</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Percent className="h-4 w-4 text-green-600" />
                        <div>
                          <span className="font-medium text-green-800">{appliedCoupon.code}</span>
                          <p className="text-xs text-green-600">{appliedCoupon.description}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-700 hover:bg-green-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="bg-transparent"
                      >
                        {isApplyingCoupon ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <DualCurrencyDisplay usdAmount={total} size="sm" variant="primary" compact={true} />
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <span>Shipping</span>
                      {total >= 100 && (
                        <Badge variant="secondary" className="text-xs">
                          FREE
                        </Badge>
                      )}
                    </span>
                    <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <DualCurrencyDisplay
                      usdAmount={finalTotal}
                      size="lg"
                      variant="primary"
                      compact={false}
                      className="font-bold"
                    />
                  </div>
                  {discount > 0 && (
                    <div className="text-sm text-green-600 text-center">You save ${discount.toFixed(2)}!</div>
                  )}
                  {total < 100 && (
                    <div className="text-sm text-muted-foreground text-center">
                      Add ${(100 - total).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <WhatsAppButton message={generateCartWhatsAppMessage()} className="w-full" variant="outline" />
                </div>

                <p className="text-xs text-muted-foreground text-center">Secure checkout with SSL encryption</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
