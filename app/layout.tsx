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
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "ABL Natasha Enterprises - Luxury Shopping & Premium Stays",
  description:
    "Premium e-commerce platform and luxury apartment rentals by ABL Natasha Enterprises. Discover luxury perfumes, wigs, cars, wines, and body creams. Book exclusive apartment stays.",
  keywords:
    "luxury ecommerce, premium shopping, apartment rentals, luxury stays, ABL Natasha Enterprises, perfumes, wigs, luxury cars, premium wines, body creams",
  authors: [{ name: "ABL Natasha Enterprises" }],
  creator: "ABL Natasha Enterprises",
  publisher: "ABL Natasha Enterprises",
  generator: "Next.js",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ablnatasha.vercel.app"),
  openGraph: {
    title: "ABL Natasha Enterprises - Luxury Shopping & Premium Stays",
    description: "Premium e-commerce platform and luxury apartment rentals by ABL Natasha Enterprises",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ablnatasha.vercel.app",
    siteName: "ABL Natasha Enterprises",
    images: [
      {
        url: "/abl-natasha-logo.png",
        width: 1200,
        height: 630,
        alt: "ABL Natasha Enterprises - Luxury Shopping & Premium Stays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABL Natasha Enterprises - Luxury Shopping & Premium Stays",
    description: "Premium e-commerce platform and luxury apartment rentals",
    images: ["/abl-natasha-logo.png"],
    creator: "@ablnatasha",
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
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://ablnatasha.vercel.app",
  },
  category: "E-commerce",
  classification: "Business",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.vercel.com" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ABL Natasha Enterprises",
              url: "https://ablnatasha.vercel.app",
              logo: "https://ablnatasha.vercel.app/abl-natasha-logo.png",
              description: "Premium e-commerce platform and luxury apartment rentals",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+234-903-094-4943",
                contactType: "customer service",
                availableLanguage: "English",
              },
              sameAs: ["https://wa.me/2349030944943"],
            }),
          }}
        />
      </head>
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
