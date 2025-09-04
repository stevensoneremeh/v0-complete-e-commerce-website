import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Shield, Clock, Building2, Home, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-d87osryg91ycSMO0JRVMoOSmYnhH4e.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">ABL Natasha Enterprises 2024</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance text-white">
                Luxury
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Living
                </span>
                <span className="block text-white">& Premium Shopping</span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg leading-relaxed text-pretty">
                Experience the finest in luxury apartment rentals and premium product shopping. ABL Natasha Enterprises
                delivers exceptional quality and unmatched elegance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl"
              >
                <Link href="/properties">Explore Luxury Stays</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 bg-white/5 backdrop-blur-sm text-white"
              >
                <Link href="/products">Shop Premium</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-white">Luxury Apartments</span>
                <span className="text-xs text-white/70">Premium locations</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium text-white">24/7 Concierge</span>
                <span className="text-xs text-white/70">Premium service</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-white">Secure Booking</span>
                <span className="text-xs text-white/70">Protected payments</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium text-white">Premium Quality</span>
                <span className="text-xs text-white/70">Curated excellence</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-3xl scale-110"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="relative group cursor-pointer">
                <Image
                  src="/luxury-living-room.jpeg"
                  alt="Luxury Living Room - ABL Natasha Enterprises"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20 rounded-2xl group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Experience Luxury Living</h3>
                <p className="text-white/80 text-sm">Premium furnished apartments with world-class amenities</p>
              </div>

              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full p-3 shadow-2xl animate-pulse">
                <Home className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
