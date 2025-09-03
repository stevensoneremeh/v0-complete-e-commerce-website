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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Featured Properties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of luxury apartments and premium accommodations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card
              key={property.id}
              className="group overflow-hidden border-0 premium-shadow hover:shadow-2xl transition-all duration-300 elegant-hover"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-white">{property.property_type}</Badge>
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
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
