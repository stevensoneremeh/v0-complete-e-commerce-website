"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { convertCurrency, formatCurrency, getExchangeRate } from "@/lib/currency"

interface CurrencySelectorProps {
  amount: number
  onCurrencyChange?: (currency: "USD" | "NGN", convertedAmount: number) => void
  className?: string
}

export function CurrencySelector({ amount, onCurrencyChange, className }: CurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD")
  const exchangeRate = getExchangeRate()

  const handleCurrencyChange = (currency: "USD" | "NGN") => {
    setSelectedCurrency(currency)
    const convertedAmount = convertCurrency(amount, "USD", currency)
    onCurrencyChange?.(currency, convertedAmount)
  }

  const convertedAmount = convertCurrency(amount, "USD", selectedCurrency)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="NGN">NGN (₦)</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-right">
          <div className="text-lg font-bold">{formatCurrency(convertedAmount, selectedCurrency)}</div>
          {selectedCurrency === "NGN" && (
            <div className="text-sm text-muted-foreground">≈ {formatCurrency(amount, "USD")}</div>
          )}
        </div>
      </div>

      {selectedCurrency === "NGN" && (
        <Badge variant="outline" className="text-xs">
          Rate: 1 USD = ₦{exchangeRate.NGN.toLocaleString()}
        </Badge>
      )}
    </div>
  )
}
