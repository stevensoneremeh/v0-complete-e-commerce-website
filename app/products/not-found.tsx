"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="relative">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted/20 mb-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Product Not Found
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">This Product Doesn't Exist</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The product you're looking for might be out of stock, discontinued, or the URL was entered incorrectly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
            >
              <Link href="/products">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-2 bg-transparent">
              <Link href="/categories">
                <Search className="h-5 w-5 mr-2" />
                Shop Categories
              </Link>
            </Button>
          </div>

          <div className="pt-6">
            <p className="text-muted-foreground">
              Can't find what you're looking for?{" "}
              <a
                href="https://wa.me/2349030944943"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message us on WhatsApp
              </a>{" "}
              for personalized assistance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
