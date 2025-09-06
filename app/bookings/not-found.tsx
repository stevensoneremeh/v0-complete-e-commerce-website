"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BookingNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="relative">
              <Calendar className="h-24 w-24 mx-auto text-muted/20 mb-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Booking Not Found
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">This Booking Doesn't Exist</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The booking you're looking for might have been cancelled, completed, or the URL was entered incorrectly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
            >
              <Link href="/bookings">
                <Calendar className="h-5 w-5 mr-2" />
                My Bookings
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-2 bg-transparent">
              <Link href="/properties">
                <Home className="h-5 w-5 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </div>

          <div className="pt-6">
            <p className="text-muted-foreground">
              Need help with your booking?{" "}
              <a
                href="https://wa.me/2349030944943"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact us on WhatsApp
              </a>{" "}
              for immediate assistance.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
