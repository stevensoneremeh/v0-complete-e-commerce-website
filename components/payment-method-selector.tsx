"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Building, Banknote, Shield, Star, Clock } from "lucide-react"

interface PaymentMethod {
  id: string
  name: string
  icon: React.ComponentType<any>
  description: string
  processingTime: string
  fees?: string
  recommended?: boolean
  popular?: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "paystack",
    name: "Paystack",
    icon: CreditCard,
    description: "Secure payment with cards, bank transfer, USSD",
    processingTime: "Instant",
    fees: "No additional fees",
    recommended: true,
    popular: true,
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Building,
    description: "Direct bank transfer",
    processingTime: "1-3 business days",
    fees: "Bank charges may apply",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: Banknote,
    description: "Pay when you receive your order",
    processingTime: "On delivery",
    fees: "₦200 service charge",
  },
]

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodChange: (method: string) => void
  onBankDetailsChange?: (details: { bankName: string; accountNumber: string }) => void
  className?: string
}

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  onBankDetailsChange,
  className,
}: PaymentMethodSelectorProps) {
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const handleBankDetailsChange = (field: string, value: string) => {
    if (field === "bankName") {
      setBankName(value)
    } else if (field === "accountNumber") {
      setAccountNumber(value)
    }

    onBankDetailsChange?.({
      bankName: field === "bankName" ? value : bankName,
      accountNumber: field === "accountNumber" ? value : accountNumber,
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span>Payment Method</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          {paymentMethods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id

            return (
              <div
                key={method.id}
                className={`relative p-4 border-2 rounded-lg transition-all cursor-pointer hover:border-primary/50 ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <Icon className="h-6 w-6 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer text-base">
                        {method.name}
                      </Label>
                      {method.recommended && (
                        <Badge variant="default" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                      {method.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{method.processingTime}</span>
                      </div>
                      <span>•</span>
                      <span>{method.fees}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Details */}
                {isSelected && method.id === "bank" && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Select Your Bank *</Label>
                      <Select value={bankName} onValueChange={(value) => handleBankDetailsChange("bankName", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gtb">GTBank - Guaranty Trust Bank</SelectItem>
                          <SelectItem value="access">Access Bank</SelectItem>
                          <SelectItem value="zenith">Zenith Bank</SelectItem>
                          <SelectItem value="uba">UBA - United Bank for Africa</SelectItem>
                          <SelectItem value="firstbank">First Bank of Nigeria</SelectItem>
                          <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                          <SelectItem value="union">Union Bank</SelectItem>
                          <SelectItem value="sterling">Sterling Bank</SelectItem>
                          <SelectItem value="fcmb">FCMB</SelectItem>
                          <SelectItem value="wema">Wema Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => handleBankDetailsChange("accountNumber", e.target.value)}
                        placeholder="Enter your 10-digit account number"
                        maxLength={10}
                      />
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Bank transfer details will be provided after order confirmation. Please
                        ensure your account details are correct for verification purposes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Details */}
                {isSelected && method.id === "cod" && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Cash on Delivery Terms:</strong>
                      </p>
                      <ul className="text-sm text-amber-700 mt-2 space-y-1 list-disc list-inside">
                        <li>₦200 service charge applies</li>
                        <li>Available within Lagos, Abuja, and Port Harcourt</li>
                        <li>Delivery within 2-5 business days</li>
                        <li>Payment must be made in exact amount</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </RadioGroup>

        {/* Security Notice */}
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            All payments are secured with 256-bit SSL encryption and PCI DSS compliance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
