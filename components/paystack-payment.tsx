"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Lock, Shield } from "lucide-react"

interface PaystackPaymentProps {
  amount: number
  email: string
  onSuccess: (reference: string) => void
  onError: (error: string) => void
  disabled?: boolean
}

export function PaystackPayment({ amount, email, onSuccess, onError, disabled }: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
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

    setIsLoading(true)

    try {
      // Load Paystack script dynamically
      if (!window.PaystackPop) {
        const script = document.createElement("script")
        script.src = "https://js.paystack.co/v1/inline.js"
        script.async = true
        document.head.appendChild(script)

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
      }

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_your_public_key_here",
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo (smallest currency unit)
        currency: "NGN", // Nigerian Naira - change as needed
        ref: `abl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metadata: {
          custom_fields: [
            {
              display_name: "ABL Natasha Enterprises Order",
              variable_name: "order_source",
              value: "website",
            },
          ],
        },
        callback: (response: any) => {
          console.log("[v0] Paystack payment successful:", response)
          toast({
            title: "Payment Successful!",
            description: `Payment completed successfully. Reference: ${response.reference}`,
          })
          onSuccess(response.reference)
        },
        onClose: () => {
          console.log("[v0] Paystack payment window closed")
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled. You can try again.",
            variant: "destructive",
          })
          setIsLoading(false)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("[v0] Paystack initialization error:", error)
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
      onError("Failed to initialize payment")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Secure Payment with Paystack</span>
          <Shield className="h-4 w-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border">
          <div>
            <p className="font-semibold">Total Amount</p>
            <p className="text-2xl font-bold text-primary">₦{amount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Secure Payment</p>
            <div className="flex items-center space-x-1">
              <Lock className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">SSL Protected</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-email">Email Address</Label>
          <Input id="payment-email" type="email" value={email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">Payment confirmation will be sent to this email address</p>
        </div>

        <Button
          onClick={initializePaystack}
          disabled={disabled || isLoading || !email}
          className="w-full h-12 text-lg font-semibold luxury-gradient text-white hover:scale-105 transition-transform duration-300"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Pay ₦{amount.toLocaleString()} with Paystack</span>
            </div>
          )}
        </Button>

        <div className="flex items-center justify-center space-x-4 pt-2">
          <img src="https://paystack.com/assets/img/payments/visa.png" alt="Visa" className="h-6" />
          <img src="https://paystack.com/assets/img/payments/mastercard.png" alt="Mastercard" className="h-6" />
          <img src="https://paystack.com/assets/img/payments/verve.png" alt="Verve" className="h-6" />
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Your payment is secured by Paystack's industry-leading encryption and fraud protection.
        </p>
      </CardContent>
    </Card>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    PaystackPop: any
  }
}
