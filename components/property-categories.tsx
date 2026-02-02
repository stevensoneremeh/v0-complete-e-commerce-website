"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Building2, Home, Castle, Waves, MapPin, Star } from "lucide-react"

const propertyCategories = [
  {
    id: "penthouse",
    name: "Penthouses",
    description: "Luxury high-rise living with panoramic city views",
    icon: Building2,
    image: "/luxury-penthouse-city-skyline-view-modern-interior.jpg",
    count: 12,
    priceRange: "$500-2000/night",
    rating: 4.9,
    gradient: "from-blue-600/80 to-purple-600/80",
  },
  {
    id: "villa",
    name: "Villas",
    description: "Private luxury estates with exclusive amenities",
    icon: Castle,
    image: "/luxury-villa-private-pool-garden-mediterranean-sty.jpg",
    count: 8,
    priceRange: "$800-3000/night",
    rating: 4.8,
    gradient: "from-emerald-600/80 to-teal-600/80",
  },
  {
    id: "apartment",
    name: "Apartments",
    description: "Modern urban living in prime locations",
    icon: Home,
    image: "/modern-luxury-apartment-urban-city-center-contempo.jpg",
    count: 24,
    priceRange: "$200-800/night",
    rating: 4.7,
    gradient: "from-orange-600/80 to-red-600/80",
  },
  {
    id: "beachfront",
    name: "Beachfront",
    description: "Oceanside retreats with private beach access",
    icon: Waves,
    image: "/beachfront-luxury-resort-ocean-view-private-beach-.jpg",
    count: 6,
    priceRange: "$1000-5000/night",
    rating: 5.0,
    gradient: "from-cyan-600/80 to-blue-600/80",
  },
]

export function PropertyCategories() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-secondary/20">
      <div className="responsive-container">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4 sm:mb-6">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">ACCOMMODATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
            Luxury Stay Categories
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto text-pretty px-2 sm:px-0">
            Curated selection of premium accommodations, each offering unique experiences and exceptional amenities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 slide-up">
          {propertyCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={`/properties?category=${category.id}`} className="group">
                <Card className="overflow-hidden border-0 premium-shadow hover:shadow-2xl elegant-hover cursor-pointer h-full">
                  <div className="relative overflow-hidden h-64 sm:h-80">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={`${category.name} - ${category.description}`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-50 transition-opacity duration-300`}
                    />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      {/* Top section */}
                      <div className="flex items-start justify-between">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{category.rating}</span>
                        </div>
                      </div>

                      {/* Bottom section */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="heading-2 mb-2 group-hover:scale-105 transition-transform origin-left">
                            {category.name}
                          </h3>
                          <p className="body-medium text-white/90 mb-3 line-clamp-2">{category.description}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{category.count} properties</span>
                            </div>
                            <div className="text-lg font-bold">{category.priceRange}</div>
                          </div>

                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                            <span className="text-lg">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Enhanced call to action */}
        <div className="text-center mt-16 fade-in">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
            <h3 className="heading-2 mb-4">Ready to Experience Luxury?</h3>
            <p className="body-medium text-muted-foreground mb-6 max-w-2xl mx-auto">
              Browse our complete collection of premium properties and find your perfect luxury getaway
            </p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 luxury-button px-8 py-4 rounded-xl text-base font-semibold group"
            >
              Explore All Properties
              <Building2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
