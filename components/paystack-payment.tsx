"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle } from "lucide-react"

interface PaystackPaymentProps {
  amount: number
  email: string
  onSuccess: (reference: string) => void
  onError: (error: string) => void
  disabled?: boolean
  currency?: "NGN" | "USD"
  customerName?: string
}

export function PaystackPayment({
  amount,
  email,
  onSuccess,
  onError,
  disabled,
  currency = "NGN",
  customerName,
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const { toast } = useToast()

  const initializePaystack = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide your email address to proceed with payment.",
        variant: "destructive",
      })
      return
    }

    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
      toast({
        title: "Payment Configuration Error",
        description: "Payment system is not properly configured. Please contact support.",
        variant: "destructive",
      })
      onError("Payment system configuration error")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")

    try {
      // Load Paystack script dynamically
      if (!window.PaystackPop) {
        const script = document.createElement("script")
        script.src = "https://js.paystack.co/v1/inline.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = () => reject(new Error("Failed to load Paystack script"))
          setTimeout(() => reject(new Error("Paystack script load timeout")), 10000)
        })
      }

      const paymentConfig = {
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: Math.round(amount * 100), // Convert to smallest currency unit
        currency: currency,
        ref: `abl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: customerName || "N/A",
            },
            {
              display_name: "Order Source",
              variable_name: "order_source",
              value: "ABL Natasha Enterprises Website",
            },
            {
              display_name: "Payment Currency",
              variable_name: "currency",
              value: currency,
            },
          ],
        },
        callback: (response: any) => {
          console.log("[v0] Paystack payment successful:", response)
          setPaymentStatus("success")
          toast({
            title: "Payment Successful! 🎉",
            description: `Your payment has been processed successfully. Reference: ${response.reference}`,
          })

          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "purchase", {
              transaction_id: response.reference,
              value: amount / 100,
              currency: currency,
              event_category: "ecommerce",
            })
          }

          onSuccess(response.reference)
          setIsLoading(false)
        },
        onClose: () => {
          console.log("[v0] Paystack payment window closed")
          setPaymentStatus("idle")
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled. You can try again when ready.",
            variant: "destructive",
          })
          setIsLoading(false)
        },
      }

      const handler = window.PaystackPop.setup(paymentConfig)
      handler.openIframe()
    } catch (error) {
      console.error("[v0] Paystack initialization error:", error)
      setPaymentStatus("error")
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      toast({
        title: "Payment Error",
        description: `Failed to initialize payment: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive",
      })
      onError(`Failed to initialize payment: ${errorMessage}`)
      setIsLoading(false)
    }
  }

  const getStatusIndicator = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Processing payment...</span>
          </div>
        )
      case "success":
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Payment successful!</span>
          </div>
        )
      case "error":
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Payment failed. Please try again.</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>Secure Payment with Paystack</span>
            <Shield className="h-4 w-4 text-green-600" />
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Trusted
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <div>
            <p className="font-semibold text-foreground">Total Amount</p>
            <p className="text-2xl font-bold text-primary">
              {currency === "NGN" ? "₦" : "$"}
              {amount.toLocaleString()}
            </p>
            {currency === "NGN" && <p className="text-xs text-muted-foreground">≈ ${(amount / 1650).toFixed(2)} USD</p>}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Secure Payment</p>
            <div className="flex items-center space-x-1">
              <Lock className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">256-bit SSL</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-email">Email Address</Label>
          <Input
            id="payment-email"
            type="email"
            value={email}
            disabled
            className="bg-muted border-muted-foreground/20"
          />
          <p className="text-xs text-muted-foreground">
            Payment confirmation and receipt will be sent to this email address
          </p>
        </div>

        {getStatusIndicator()}

        <Button
          onClick={initializePaystack}
          disabled={disabled || isLoading || !email || paymentStatus === "success"}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white hover:scale-[1.02] transition-all duration-300 shadow-lg"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Initializing Payment...</span>
            </div>
          ) : paymentStatus === "success" ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Payment Completed</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>
                Pay {currency === "NGN" ? "₦" : "$"}
                {amount.toLocaleString()} Securely
              </span>
            </div>
          )}
        </Button>

        <div className="space-y-3">
          <p className="text-sm font-medium text-center text-muted-foreground">Accepted Payment Methods</p>
          <div className="flex items-center justify-center space-x-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <img src="https://paystack.com/assets/img/payments/visa.png" alt="Visa" className="h-6 object-contain" />
              <img
                src="https://paystack.com/assets/img/payments/mastercard.png"
                alt="Mastercard"
                className="h-6 object-contain"
              />
              <img
                src="https://paystack.com/assets/img/payments/verve.png"
                alt="Verve"
                className="h-6 object-contain"
              />
            </div>
            <div className="text-xs text-muted-foreground">+ Bank Transfer, USSD</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 pt-2">
          <Shield className="h-4 w-4 text-green-600" />
          <p className="text-xs text-center text-muted-foreground">
            Your payment is secured by Paystack's industry-leading encryption, PCI DSS compliance, and advanced fraud
            protection.
          </p>
        </div>

        <div className="text-center pt-2 border-t border-muted">
          <p className="text-xs text-muted-foreground">
            Need help? Contact us via WhatsApp or email for payment assistance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    PaystackPop: any
    gtag: any
  }
}
