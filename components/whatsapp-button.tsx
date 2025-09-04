"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  productName?: string
  productPrice?: number
  productUrl?: string
  message?: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WhatsAppButton({
  productName,
  productPrice,
  productUrl,
  message,
  className,
  variant = "outline",
  size = "default",
}: WhatsAppButtonProps) {
  const whatsappNumber = "+2349030944943"

  const generateMessage = () => {
    if (message) return message

    let defaultMessage = "Hello! I'm interested in "

    if (productName) {
      defaultMessage += `*${productName}*`

      if (productPrice) {
        defaultMessage += ` (Price: $${productPrice})`
      }

      if (productUrl) {
        defaultMessage += `\n\nProduct Link: ${productUrl}`
      }

      defaultMessage += "\n\nCould you please provide more information or help me with the purchase?"
    } else {
      defaultMessage += "your products. Could you please assist me?"
    }

    return defaultMessage
  }

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(generateMessage())
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleWhatsAppClick}
      className={`bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 ${className}`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {productName ? "Ask via WhatsApp" : "Contact via WhatsApp"}
    </Button>
  )
}
