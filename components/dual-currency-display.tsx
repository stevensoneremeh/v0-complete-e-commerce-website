"use client"

import { formatDualCurrency } from "@/lib/currency"
import { Badge } from "@/components/ui/badge"

interface DualCurrencyDisplayProps {
  usdAmount: number
  className?: string
  showBoth?: boolean
  primaryCurrency?: "USD" | "NGN"
  compact?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "muted" | "primary"
}

export function DualCurrencyDisplay({
  usdAmount,
  className = "",
  showBoth = true,
  primaryCurrency = "USD",
  compact = false,
  size = "md",
  variant = "default",
}: DualCurrencyDisplayProps) {
  const { primary, secondary, both } = formatDualCurrency(usdAmount, {
    showBoth,
    primaryCurrency,
    compact,
  })

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
  }

  const variantClasses = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    primary: "text-primary font-semibold",
  }

  if (!showBoth) {
    return <span className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>{primary}</span>
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`${sizeClasses[size]} ${variantClasses[variant]}`}>{primary}</span>
        <Badge variant="outline" className="text-xs">
          {secondary}
        </Badge>
      </div>
    )
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className={`${sizeClasses[size]} ${variantClasses[variant]}`}>{primary}</div>
      <div className="text-sm text-muted-foreground">{secondary}</div>
    </div>
  )
}
