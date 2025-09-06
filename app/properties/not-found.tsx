"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Building2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="relative">
              <Building2 className="h-24 w-24 mx-auto text-muted/20 mb-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Property Not Found
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">This Property Doesn't Exist</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The property you're looking for might have been removed, is no longer available, or the URL was entered
              incorrectly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
            >
              <Link href="/properties">
                <Building2 className="h-5 w-5 mr-2" />
                Browse Properties
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-2 bg-transparent">
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="pt-6">
            <p className="text-muted-foreground">
              Looking for something specific?{" "}
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Contact us
              </Link>{" "}
              and we'll help you find the perfect property.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
