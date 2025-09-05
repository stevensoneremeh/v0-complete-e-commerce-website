// Currency conversion utilities
export interface CurrencyRate {
  USD: number
  NGN: number
  lastUpdated: string
}

// Mock exchange rate - in production, this would come from an API
const EXCHANGE_RATES: CurrencyRate = {
  USD: 1,
  NGN: 1650, // 1 USD = 1650 NGN (update as needed)
  lastUpdated: new Date().toISOString(),
}

export function convertCurrency(amount: number, fromCurrency: "USD" | "NGN", toCurrency: "USD" | "NGN"): number {
  if (fromCurrency === toCurrency) return amount

  if (fromCurrency === "USD" && toCurrency === "NGN") {
    return amount * EXCHANGE_RATES.NGN
  }

  if (fromCurrency === "NGN" && toCurrency === "USD") {
    return amount / EXCHANGE_RATES.NGN
  }

  return amount
}

export function formatCurrency(amount: number, currency: "USD" | "NGN"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (currency === "NGN") {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return amount.toString()
}

export function formatDualCurrency(
  usdAmount: number,
  options?: {
    showBoth?: boolean
    primaryCurrency?: "USD" | "NGN"
    compact?: boolean
  },
): {
  primary: string
  secondary: string
  both: string
} {
  const { showBoth = true, primaryCurrency = "USD", compact = false } = options || {}

  const ngnAmount = convertCurrency(usdAmount, "USD", "NGN")
  const usdFormatted = formatCurrency(usdAmount, "USD")
  const ngnFormatted = formatCurrency(ngnAmount, "NGN")

  if (compact) {
    return {
      primary: primaryCurrency === "USD" ? `$${usdAmount.toLocaleString()}` : `₦${ngnAmount.toLocaleString()}`,
      secondary: primaryCurrency === "USD" ? `₦${ngnAmount.toLocaleString()}` : `$${usdAmount.toLocaleString()}`,
      both: `$${usdAmount.toLocaleString()} / ₦${ngnAmount.toLocaleString()}`,
    }
  }

  return {
    primary: primaryCurrency === "USD" ? usdFormatted : ngnFormatted,
    secondary: primaryCurrency === "USD" ? ngnFormatted : usdFormatted,
    both: `${usdFormatted} / ${ngnFormatted}`,
  }
}

export function getExchangeRate(): CurrencyRate {
  return EXCHANGE_RATES
}
