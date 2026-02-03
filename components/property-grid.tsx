"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Bed, Bath, Star, Heart } from "lucide-react"
import { useWishlist } from "@/components/wishlist-provider"
import { useRealtimeProperties } from "@/hooks/use-realtime-properties"
import { splitPropertyMedia } from "@/lib/property-media"

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
  is_available_for_booking?: boolean
}

interface Filters {
  priceRange: number[]
  bedrooms: string
  propertyType: string
  amenities: string[]
}

interface PropertyGridProps {
  searchQuery: string
  filters: Filters
}

export function PropertyGrid({ searchQuery, filters }: PropertyGridProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const refreshTrigger = useRealtimeProperties()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties")
        if (response.ok) {
          const data = await response.json()
          const raw = Array.isArray(data) ? data : data.properties || []
          const mapped: Property[] = raw.map((item: any) => {
            const media = splitPropertyMedia(item.images || item.products?.images)
            const bedrooms = Number(item.bedrooms ?? 1)
            return {
              id: item.id,
              title: item.title || item.products?.name || "Property",
              location: item.location || "",
              price_per_night: Number(item.booking_price_per_night ?? item.products?.price ?? 0),
              bedrooms,
              bathrooms: Number(item.bathrooms ?? 1),
              guests: Number((item.max_guests ?? bedrooms * 2) || 1),
              rating: Number(item.rating ?? 4.8),
              images: media.images,
              amenities: Array.isArray(item.amenities) ? item.amenities : [],
              property_type: item.property_type || "property",
              is_featured: Boolean(item.is_featured),
              is_available_for_booking: item.is_available_for_booking,
            }
          })

          // Apply filters
          let filteredProperties = mapped

          if (searchQuery) {
            filteredProperties = filteredProperties.filter(
              (property) =>
                property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.property_type.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          }

          filteredProperties = filteredProperties.filter(
            (property) =>
              property.price_per_night >= filters.priceRange[0] && property.price_per_night <= filters.priceRange[1],
          )

          if (filters.bedrooms && filters.bedrooms !== "any") {
            const bedroomCount = Number.parseInt(filters.bedrooms)
            if (bedroomCount === 4) {
              filteredProperties = filteredProperties.filter((property) => property.bedrooms >= 4)
            } else {
              filteredProperties = filteredProperties.filter((property) => property.bedrooms === bedroomCount)
            }
          }

          if (filters.propertyType && filters.propertyType !== "any") {
            filteredProperties = filteredProperties.filter((property) => property.property_type === filters.propertyType)
          }

          if (filters.amenities.length > 0) {
            filteredProperties = filteredProperties.filter((property) =>
              filters.amenities.every((amenity) => property.amenities.includes(amenity)),
            )
          }

          setProperties(filteredProperties)
        } else {
          setProperties([])
        }
      } catch (error) {
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchQuery, filters, refreshTrigger])

  const handleWishlistToggle = (property: Property) => {
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id)
    } else {
      addToWishlist({
        id: property.id,
        name: property.title,
        price: property.price_per_night,
        image: property.images[0],
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 bg-muted rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No properties found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {properties.length} {properties.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Badge className="absolute top-4 left-4 bg-primary text-white capitalize">{property.property_type}</Badge>
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{property.rating}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => handleWishlistToggle(property)}
                >
                  <Heart
                    className={`h-4 w-4 ${isInWishlist(property.id) ? "fill-red-500 text-red-500" : "text-white"}`}
                  />
                </Button>
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
    </div>
  )
}
