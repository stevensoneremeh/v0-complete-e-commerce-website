"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Building2, Home, Castle, Waves } from "lucide-react"

const propertyCategories = [
  {
    id: "penthouse",
    name: "Penthouses",
    description: "Luxury high-rise living",
    icon: Building2,
    image: "/luxury-penthouse-city-view.png",
    count: 12,
  },
  {
    id: "villa",
    name: "Villas",
    description: "Private luxury estates",
    icon: Castle,
    image: "/luxury-villa-pool.png",
    count: 8,
  },
  {
    id: "apartment",
    name: "Apartments",
    description: "Modern urban living",
    icon: Home,
    image: "/modern-apartment.png",
    count: 24,
  },
  {
    id: "beachfront",
    name: "Beachfront",
    description: "Oceanside retreats",
    icon: Waves,
    image: "/beachfront-property-ocean-view.png",
    count: 6,
  },
]

export function PropertyCategories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Property Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our diverse selection of premium accommodations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={`/properties?category=${category.id}`}>
                <Card className="group overflow-hidden border-0 premium-shadow hover:shadow-2xl transition-all duration-300 elegant-hover cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-semibold text-lg">{category.name}</span>
                      </div>
                      <p className="text-sm text-white/80">{category.description}</p>
                      <p className="text-xs text-white/60 mt-1">{category.count} properties</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
