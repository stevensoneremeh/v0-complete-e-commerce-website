"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Building2, ShoppingBag } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="space-y-4">
          <div className="relative">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 text-9xl font-bold text-muted/10 blur-sm">404</div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, deleted, or the URL was entered
            incorrectly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:scale-105 transition-transform"
          >
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="border-2 hover:bg-muted/50 bg-transparent">
            <Link href="/products">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shop Products
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="border-2 hover:bg-muted/50 bg-transparent">
            <Link href="/properties">
              <Building2 className="h-5 w-5 mr-2" />
              View Properties
            </Link>
          </Button>
          <Button variant="ghost" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="pt-8 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center overflow-hidden">
              <Image
                src="/abl-natasha-logo.png"
                alt="ABL Natasha Enterprises"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              ABL Natasha Enterprises
            </span>
          </div>
          <p className="text-muted-foreground">
            Need assistance?{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact our support team
            </Link>{" "}
            or call{" "}
            <a href="tel:+2349030944943" className="text-primary hover:underline font-medium">
              +234 903 094 4943
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
