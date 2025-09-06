"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Search, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PropertyDetailNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="relative">
              <Building2 className="h-24 w-24 mx-auto text-muted/20 mb-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Property Not Available
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">This Property Cannot Be Found</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The property you're looking for might have been sold, is no longer available for booking, or the property
              ID is incorrect.
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
                Browse All Properties
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-2 bg-transparent">
              <Link href="/properties?search=luxury">
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </Link>
            </Button>
          </div>

          <div className="pt-6 space-y-4">
            <Button variant="ghost" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>

            <p className="text-muted-foreground">
              Looking for a specific property?{" "}
              <a
                href="https://wa.me/2349030944943?text=Hi, I'm looking for a specific property but can't find it on your website. Can you help me?"
                className="text-primary hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact us on WhatsApp
              </a>{" "}
              and we'll help you find the perfect luxury accommodation.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
