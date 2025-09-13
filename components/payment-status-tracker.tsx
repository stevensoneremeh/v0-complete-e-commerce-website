"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle, CreditCard, Package, Truck, Home } from "lucide-react"

interface PaymentStatusTrackerProps {
  paymentReference?: string
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  amount: number
  currency: "USD" | "NGN"
  onRetry?: () => void
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Payment Pending",
    description: "Waiting for payment confirmation",
    progress: 25,
  },
  processing: {
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Processing Payment",
    description: "Your payment is being processed",
    progress: 50,
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Payment Successful",
    description: "Payment completed successfully",
    progress: 100,
  },
  failed: {
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Payment Failed",
    description: "Payment could not be processed",
    progress: 0,
  },
  refunded: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Payment Refunded",
    description: "Payment has been refunded",
    progress: 100,
  },
}

const orderSteps = [
  { icon: CreditCard, label: "Payment", key: "payment" },
  { icon: Package, label: "Processing", key: "processing" },
  { icon: Truck, label: "Shipping", key: "shipping" },
  { icon: Home, label: "Delivered", key: "delivered" },
]

export function PaymentStatusTracker({
  paymentReference,
  status,
  amount,
  currency,
  onRetry,
}: PaymentStatusTrackerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const config = statusConfig[status]
  const Icon = config.icon

  useEffect(() => {
    if (status === "completed") {
      setCurrentStep(1) // Move to processing step after payment
    } else if (status === "failed") {
      setCurrentStep(0)
    }
  }, [status])

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${config.bgColor}`}>
              <Icon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${config.color}`}>{config.label}</h3>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <Badge
            variant={status === "completed" ? "default" : status === "failed" ? "destructive" : "secondary"}
            className="capitalize"
          >
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-semibold text-lg">
              {currency === "NGN" ? "₦" : "$"}
              {amount.toLocaleString()}
            </p>
          </div>
          {paymentReference && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Reference</p>
              <p className="font-mono text-sm">{paymentReference}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{config.progress}%</span>
          </div>
          <Progress value={config.progress} className="h-2" />
        </div>

        {/* Order Steps (only show if payment is successful) */}
        {status === "completed" && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Order Progress</h4>
            <div className="flex items-center justify-between">
              {orderSteps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = index <= currentStep
                const isCompleted = index < currentStep

                return (
                  <div key={step.key} className="flex flex-col items-center space-y-2">
                    <div
                      className={`p-2 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? "bg-green-100 border-green-500 text-green-600"
                          : isActive
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                      }`}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {status === "failed" && onRetry && (
            <Button onClick={onRetry} className="flex-1">
              Retry Payment
            </Button>
          )}
          {status === "completed" && (
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <a href={`/orders`}>View Order Details</a>
            </Button>
          )}
          {paymentReference && (
            <Button variant="outline" className="bg-transparent" asChild>
              <a href={`mailto:support@ablnatasha.com?subject=Payment Reference: ${paymentReference}`}>
                Contact Support
              </a>
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          {status === "completed" && (
            <p>✓ Payment confirmation email has been sent to your registered email address.</p>
          )}
          {status === "processing" && (
            <p>⏳ This usually takes 1-3 minutes. Please do not refresh or close this page.</p>
          )}
          {status === "failed" && (
            <p>❌ Please check your payment details and try again, or contact support for assistance.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
