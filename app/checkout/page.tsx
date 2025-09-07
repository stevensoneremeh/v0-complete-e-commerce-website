"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useCoupon } from "@/components/coupon-provider"
import { useOrders } from "@/components/order-provider"
import { useToast } from "@/hooks/use-toast"
import { PaystackPayment } from "@/components/paystack-payment"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { CurrencySelector } from "@/components/currency-selector"
import { CreditCard, Building, Banknote, Lock, MapPin, Tag, X, Percent } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const paymentMethods = [
  {
    id: "paystack",
    name: "Paystack (Recommended)",
    icon: CreditCard,
    description: "Secure payment with cards, bank transfer, USSD",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    description: "Direct bank transfer",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: Banknote,
    description: "Pay when you receive your order",
  },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { applyCoupon, removeCoupon, calculateDiscount, appliedCoupon } = useCoupon()
  const { addOrder } = useOrders()
  const { toast } = useToast()
  const router = useRouter()

  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD")
  const [convertedTotal, setConvertedTotal] = useState(0)

  // Coupon state
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  // Shipping Information
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] || "")
  const [lastName, setLastName] = useState(user?.name?.split(" ")[1] || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("Nigeria")

  // Payment Information
  const [paymentMethod, setPaymentMethod] = useState("paystack")
  const [bankAccount, setBankAccount] = useState("")
  const [bankName, setBankName] = useState("")
  const [paymentReference, setPaymentReference] = useState("")

  const [orderNotes, setOrderNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const shippingCost = 5.99
  const tax = total * 0.08
  const discount = calculateDiscount(total)
  const finalTotal = total + shippingCost + tax - discount

  const handleCurrencyChange = (currency: "USD" | "NGN", convertedAmount: number) => {
    setSelectedCurrency(currency)
    setConvertedTotal(convertedAmount)
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    setIsApplyingCoupon(true)

    // Simulate API call
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
      description: "The coupon has been removed from your order.",
    })
  }

  const handlePaystackSuccess = (reference: string) => {
    console.log("[v0] Paystack payment successful, creating order:", reference)
    setPaymentReference(reference)
    completeOrder(reference)
  }

  const handlePaystackError = (error: string) => {
    console.log("[v0] Paystack payment error:", error)
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
  }

  const completeOrder = async (reference?: string) => {
    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create order
    const orderId = addOrder({
      status: "processing",
      total: finalTotal,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        country,
      },
      paymentMethod: paymentMethods.find((pm) => pm.id === paymentMethod)?.name || paymentMethod,
      couponCode: appliedCoupon?.code,
      discount,
    })

    toast({
      title: "Order placed successfully!",
      description: `Thank you for your purchase with ABL Natasha Enterprises. Order ${orderId} has been created. ${appliedCoupon ? `You saved $${discount.toFixed(2)} with coupon ${appliedCoupon.code}!` : ""} You will receive a confirmation email shortly.`,
    })

    clearCart()
    if (appliedCoupon) {
      removeCoupon()
    }
    router.push("/orders")
    setIsProcessing(false)
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "paystack") {
      // Paystack payment will handle order completion
      return
    }

    // For other payment methods, complete order directly
    completeOrder()
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
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase with ABL Natasha Enterprises</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Shipping Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 1234567"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House number and street name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={state} onValueChange={setState} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                          <SelectItem value="kano">Kano</SelectItem>
                          <SelectItem value="rivers">Rivers</SelectItem>
                          <SelectItem value="oyo">Oyo</SelectItem>
                          <SelectItem value="kaduna">Kaduna</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="Ghana">Ghana</SelectItem>
                        <SelectItem value="Kenya">Kenya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div key={method.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </RadioGroup>

                  {/* Payment Details */}
                  {paymentMethod === "paystack" && (
                    <PaystackPayment
                      amount={convertedTotal || finalTotal * 1650}
                      email={email}
                      currency={selectedCurrency}
                      customerName={`${firstName} ${lastName}`}
                      onSuccess={handlePaystackSuccess}
                      onError={handlePaystackError}
                      disabled={!email || !firstName || !lastName || !address}
                    />
                  )}

                  {paymentMethod === "bank" && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name *</Label>
                        <Select value={bankName} onValueChange={setBankName} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your bank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gtb">GTBank - Guaranty Trust Bank</SelectItem>
                            <SelectItem value="access">Access Bank</SelectItem>
                            <SelectItem value="zenith">Zenith Bank</SelectItem>
                            <SelectItem value="uba">UBA - United Bank for Africa</SelectItem>
                            <SelectItem value="firstbank">First Bank of Nigeria</SelectItem>
                            <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Account Number *</Label>
                        <Input
                          id="bankAccount"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          placeholder="Enter your account number"
                          required
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Bank transfer details will be provided after order confirmation.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered. Additional charges may apply.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Special instructions for your order..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Currency Selector */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Currency</span>
                    </div>
                    <CurrencySelector amount={finalTotal} onCurrencyChange={handleCurrencyChange} />
                  </div>

                  <Separator />

                  {/* Coupon Section */}
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

                    {/* Demo Coupons */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs font-medium text-blue-800 mb-2">Demo Coupons (Try these!):</p>
                      <div className="space-y-1 text-xs text-blue-700">
                        <div className="flex justify-between">
                          <Badge variant="outline" className="text-xs">
                            WELCOME10
                          </Badge>
                          <span>10% off orders $50+</span>
                        </div>
                        <div className="flex justify-between">
                          <Badge variant="outline" className="text-xs">
                            SAVE20
                          </Badge>
                          <span>$20 off orders $100+</span>
                        </div>
                        <div className="flex justify-between">
                          <Badge variant="outline" className="text-xs">
                            BIGDEAL
                          </Badge>
                          <span>25% off orders $200+</span>
                        </div>
                        <div className="flex justify-between">
                          <Badge variant="outline" className="text-xs">
                            FREESHIP
                          </Badge>
                          <span>Free shipping</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
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
                      <div className="text-right">
                        <span>${finalTotal.toFixed(2)}</span>
                        {selectedCurrency === "NGN" && (
                          <div className="text-sm text-muted-foreground font-normal">
                            ≈ ₦{(convertedTotal || finalTotal * 1650).toLocaleString()}
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="text-sm text-green-600 font-normal">You save ${discount.toFixed(2)}!</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <WhatsAppButton message={generateCartWhatsAppMessage()} className="w-full" variant="outline" />
                  </div>

                  {paymentMethod !== "paystack" && (
                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                      {isProcessing ? "Processing..." : `Place Order - $${finalTotal.toFixed(2)}`}
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
