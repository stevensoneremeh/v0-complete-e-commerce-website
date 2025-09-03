import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { ReviewsProvider } from "@/components/reviews-provider"
import { CouponProvider } from "@/components/coupon-provider"
import { OrderProvider } from "@/components/order-provider"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "ABL Natasha Enterprises - Luxury Shopping & Premium Stays",
  description: "Premium e-commerce platform and luxury apartment rentals by ABL Natasha Enterprises",
  keywords: "luxury ecommerce, premium shopping, apartment rentals, luxury stays, ABL Natasha Enterprises",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ReviewsProvider>
              <WishlistProvider>
                <CouponProvider>
                  <OrderProvider>
                    <CartProvider>
                      {children}
                      <Toaster />
                    </CartProvider>
                  </OrderProvider>
                </CouponProvider>
              </WishlistProvider>
            </ReviewsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
