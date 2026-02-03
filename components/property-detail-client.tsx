"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, ArrowLeft, Heart, Share2 } from "lucide-react"
import { PropertyBooking } from "@/components/property-booking"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/hooks/use-toast"

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  address: string
  bedrooms: number
  bathrooms: number
  area: number
  property_type: string
  listing_type: string
  amenities: string[]
  features: string[]
  images: string[]
  videos?: string[]
  available: boolean
  featured: boolean
  virtual_tour_url?: string
  booking_price_per_night?: number
  minimum_stay_nights?: number
  is_available_for_booking?: boolean
}

interface PropertyDetailClientProps {
  property: Property
}

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleWishlistToggle = () => {
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id)
      toast({
        title: "Removed from wishlist",
        description: `${property.title} has been removed from your wishlist.`,
        variant: "destructive",
      })
    } else {
      addToWishlist({
        id: property.id,
        name: property.title,
        price: property.price,
        image: property.images[0],
      })
      toast({
        title: "Added to wishlist!",
        description: `${property.title} has been added to your wishlist.`,
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Property link has been copied to clipboard.",
      })
    }
  }

  return (
    <main className="responsive-container py-8 sm:py-12 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto pb-2">
        <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
          Home
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <Link href="/properties" className="hover:text-primary transition-colors whitespace-nowrap">
          Properties
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground whitespace-nowrap truncate">{property.title}</span>
      </div>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 sm:mb-8 h-9 px-3 text-sm">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Property Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
        <div className="space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted/20">
            <Image
              src={property.images[selectedImageIndex] || "/placeholder.svg?height=400&width=600&text=Property+Image"}
              alt={property.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {property.featured && <Badge className="absolute top-4 left-4 text-xs sm:text-sm">Featured</Badge>}
          </div>
          {property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {property.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${property.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          {property.videos && property.videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.videos.map((video, index) => (
                <video key={index} src={video} controls className="w-full rounded-xl border border-border" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <div className="flex items-start justify-between mb-4 sm:mb-6 gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 leading-tight text-balance">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-2 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{property.location}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{property.address}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 bg-transparent"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(property.id) ? "fill-accent text-accent" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
              <Badge className="text-xs sm:text-sm">{property.property_type}</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">{property.listing_type}</Badge>
              {property.available && <Badge className="bg-accent/20 text-accent text-xs sm:text-sm font-semibold">Available</Badge>}
            </div>

            <div className="mb-6 sm:mb-8 space-y-2">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                <DualCurrencyDisplay usdAmount={property.price} size="lg" variant="primary" showBoth={true} />
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-medium">
                {property.listing_type === "rent" && <span>/month</span>}
                {property.booking_price_per_night && <span>/night</span>}
              </div>
            </div>
          </div>

          {/* Property Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-4 sm:p-5 bg-secondary/40 rounded-xl border border-border/50">
              <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm sm:text-base">{property.bedrooms}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Bedrooms</div>
            </div>
            <div className="text-center p-4 sm:p-5 bg-secondary/40 rounded-xl border border-border/50">
              <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm sm:text-base">{property.bathrooms}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Bathrooms</div>
            </div>
            <div className="text-center p-4 sm:p-5 bg-secondary/40 rounded-xl border border-border/50">
              <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold text-sm sm:text-base">{property.area}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Sq Ft</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 sm:space-y-3">
            <WhatsAppButton
              product={{
                name: property.title,
                price: property.price,
                category: "Real Estate",
              }}
              className="w-full h-10 sm:h-11"
              size="default"
            />
            {property.virtual_tour_url && (
              <Button variant="outline" className="w-full luxury-button-outline h-10 sm:h-11 text-sm sm:text-base px-4 py-2 sm:py-2.5 bg-transparent" asChild>
                <Link href={property.virtual_tour_url} target="_blank">
                  Virtual Tour
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {property.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          {property.is_available_for_booking && property.booking_price_per_night ? (
            <PropertyBooking
              property={{
                id: property.id,
                title: property.title,
                pricePerNight: property.booking_price_per_night,
                minimumStay: property.minimum_stay_nights || 1,
              }}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Contact for Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Interested in this property? Get in touch with us for more information and viewing arrangements.
                </p>
                <WhatsAppButton
                  product={{
                    name: property.title,
                    price: property.price,
                    category: "Real Estate",
                  }}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
