import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Shield, Truck, Clock, Building2, Home } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 luxury-gradient opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-card"></div>

      <div className="container mx-auto px-4 py-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-card border border-primary/20 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">ABL Natasha Enterprises 2024</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
                Premium
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Shopping
                </span>
                <span className="block">& Luxury Stays</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed text-pretty">
                Discover curated premium products and luxury apartment rentals. ABL Natasha Enterprises offers
                exceptional quality in both shopping and accommodation experiences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="luxury-gradient text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 premium-shadow"
              >
                <Link href="/products">Shop Products</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-primary/20 hover:border-primary/40 px-8 py-4 rounded-xl hover:bg-card transition-all duration-300 bg-transparent"
              >
                <Link href="/properties">Book Apartments</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Free Shipping</span>
                <span className="text-xs text-muted-foreground">On orders $100+</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium">24/7 Support</span>
                <span className="text-xs text-muted-foreground">Premium service</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Secure Payment</span>
                <span className="text-xs text-muted-foreground">Protected checkout</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Premium Quality</span>
                <span className="text-xs text-muted-foreground">Curated selection</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 luxury-gradient rounded-3xl blur-3xl opacity-20 scale-110"></div>
            <div className="relative bg-card rounded-3xl p-8 premium-shadow">
              <Image
                src="/luxury-shopping-hero-image-with-premium-products.png"
                alt="Premium Shopping Experience"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl w-full h-auto"
                priority
              />
              <div className="absolute -top-4 -right-4 bg-accent text-white rounded-full p-3 premium-shadow animate-bounce">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white rounded-full p-3 premium-shadow">
                <Home className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
