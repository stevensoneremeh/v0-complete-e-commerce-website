import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { AuthProvider } from "@/components/auth-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { ReviewsProvider } from "@/components/reviews-provider"
import { CouponProvider } from "@/components/coupon-provider"
import { OrderProvider } from "@/components/order-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopHub - Complete E-Commerce Solution",
  description: "Modern e-commerce platform with admin dashboard",
  keywords: "ecommerce, shopping, online store, products",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
