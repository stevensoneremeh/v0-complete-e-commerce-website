"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface Product {
  name: string
  price: number
  category?: string
}

interface WhatsAppButtonProps {
  product?: Product
  productName?: string
  productPrice?: number
  productUrl?: string
  message?: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function WhatsAppButton({
  product,
  productName,
  productPrice,
  productUrl,
  message,
  className,
  variant = "outline",
  size = "default",
  children,
}: WhatsAppButtonProps) {
  const whatsappNumber = "+2349030944943"

  const generateMessage = () => {
    if (message) return message

    let defaultMessage = "Hello ABL Natasha Enterprises! 👋\n\n"

    const name = product?.name || productName
    const price = product?.price || productPrice
    const category = product?.category

    if (name) {
      defaultMessage += `I'm interested in: *${name}*\n`

      if (price) {
        defaultMessage += `💰 Price: $${price.toLocaleString()}\n`
      }

      if (category) {
        defaultMessage += `📂 Category: ${category}\n`
      }

      if (productUrl) {
        defaultMessage += `🔗 Link: ${productUrl}\n`
      }

      defaultMessage += "\n❓ Could you please provide more information or help me with the purchase?\n\n"
      defaultMessage += "I'm ready to buy! 🛒"
    } else {
      defaultMessage += "I'm interested in your products and services.\n\n"
      defaultMessage += "Could you please assist me with:\n"
      defaultMessage += "• Product information\n"
      defaultMessage += "• Pricing details\n"
      defaultMessage += "• Purchase process\n\n"
      defaultMessage += "Thank you! 😊"
    }

    return defaultMessage
  }

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(generateMessage())
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodedMessage}`

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: product?.name || productName || "general_inquiry",
        value: product?.price || productPrice || 0,
      })
    }

    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleWhatsAppClick}
      className={`bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 ${
        variant === "outline" ? "bg-transparent text-green-600 hover:bg-green-600 hover:text-white" : ""
      } ${className}`}
    >
      <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
      <span className="truncate">
        {children ||
          (product?.name || productName ? (
            <>
              <span className="hidden sm:inline">Buy via WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Contact via WhatsApp</span>
              <span className="sm:hidden">Contact</span>
            </>
          ))}
      </span>
    </Button>
  )
}
