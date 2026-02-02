"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Bed, Bath, Star } from "lucide-react"

interface Property {
  id: string
  title: string
  location: string
  price_per_night: number
  bedrooms: number
  bathrooms: number
  guests: number
  rating: number
  images: string[]
  amenities: string[]
  property_type: string
  is_featured: boolean
}

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for featured properties
    const mockProperties: Property[] = [
      {
        id: "1",
        title: "Luxury Downtown Penthouse",
        location: "Manhattan, New York",
        price_per_night: 450,
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        rating: 4.9,
        images: ["/luxury-penthouse-interior.png"],
        amenities: ["WiFi", "Parking", "Pool", "Gym"],
        property_type: "Penthouse",
        is_featured: true,
      },
      {
        id: "2",
        title: "Modern Seaside Villa",
        location: "Malibu, California",
        price_per_night: 650,
        bedrooms: 4,
        bathrooms: 3,
        guests: 8,
        rating: 4.8,
        images: ["/modern-seaside-villa.png"],
        amenities: ["WiFi", "Beach Access", "Hot Tub", "Kitchen"],
        property_type: "Villa",
        is_featured: true,
      },
      {
        id: "3",
        title: "Cozy Urban Loft",
        location: "Brooklyn, New York",
        price_per_night: 280,
        bedrooms: 2,
        bathrooms: 1,
        guests: 4,
        rating: 4.7,
        images: ["/urban-loft.png"],
        amenities: ["WiFi", "Kitchen", "Workspace", "Rooftop"],
        property_type: "Loft",
        is_featured: true,
      },
    ]

    setProperties(mockProperties)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <div className="animate-pulse">Loading properties...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="responsive-container">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wide">LUXURY STAYS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance leading-tight">
            Featured Properties
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty px-2 sm:px-0">
            Handpicked luxury apartments and premium accommodations for an unforgettable stay
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="group overflow-hidden luxury-card-premium border-border/50 hover:premium-shadow transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-xl bg-muted/20">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  width={400}
                  height={300}
                  className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-semibold">{property.property_type}</Badge>
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span>{property.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {property.guests}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary">${property.price_per_night}</span>
                  <span className="text-muted-foreground text-sm ml-1">/ night</span>
                </div>
                <Button asChild className="luxury-gradient text-white hover:scale-105 transition-transform">
                  <Link href={`/properties/${property.id}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-primary/20 hover:border-primary/40 bg-transparent"
          >
            <Link href="/properties">View All Properties</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
