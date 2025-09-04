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
import { ErrorBoundary } from "@/components/error-boundary"

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ablnatasha.vercel.app"),
  openGraph: {
    title: "ABL Natasha Enterprises - Luxury Shopping & Premium Stays",
    description: "Premium e-commerce platform and luxury apartment rentals by ABL Natasha Enterprises",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABL Natasha Enterprises",
    description: "Premium e-commerce platform and luxury apartment rentals",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased`}>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </body>
    </html>
  )
}
