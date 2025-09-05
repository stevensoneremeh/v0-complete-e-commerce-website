"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, ArrowLeft, Heart, Share2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyBooking } from "@/components/property-booking"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"

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
  available: boolean
  featured: boolean
  virtual_tour_url?: string
  meta_title?: string
  meta_description?: string
  booking_price_per_night?: number
  minimum_stay_nights?: number
  is_available_for_booking?: boolean
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        // First try listings_real_estate table
        const { data: listingData, error: listingError } = await supabase
          .from("listings_real_estate")
          .select("*")
          .eq("id", params.id)
          .single()

        if (listingData && !listingError) {
          setProperty({
            id: listingData.id,
            title: listingData.title,
            description: listingData.description,
            price: Number.parseFloat(listingData.price),
            location: listingData.location,
            address: listingData.address,
            bedrooms: listingData.bedrooms,
            bathrooms: listingData.bathrooms,
            area: listingData.area,
            property_type: listingData.property_type,
            listing_type: listingData.listing_type,
            amenities: listingData.amenities || [],
            features: listingData.features || [],
            images: ["/luxury-living-room.jpeg", "/placeholder.svg?height=400&width=600&text=Property+Image"],
            available: listingData.available,
            featured: listingData.featured,
            virtual_tour_url: listingData.virtual_tour_url,
            meta_title: listingData.meta_title,
            meta_description: listingData.meta_description,
          })
        } else {
          // Try real_estate_properties table with product join
          const { data: propertyData, error: propertyError } = await supabase
            .from("real_estate_properties")
            .select(`
              *,
              products (
                name,
                description,
                price,
                images,
                is_active
              )
            `)
            .eq("id", params.id)
            .single()

          if (propertyData && !propertyError) {
            setProperty({
              id: propertyData.id,
              title: propertyData.products?.name || "Luxury Property",
              description: propertyData.products?.description || "Beautiful property with modern amenities",
              price: propertyData.booking_price_per_night || Number.parseFloat(propertyData.products?.price || "0"),
              location: "Premium Location",
              address: "Luxury District",
              bedrooms: propertyData.bedrooms,
              bathrooms: propertyData.bathrooms,
              area: propertyData.square_feet,
              property_type: propertyData.property_type,
              listing_type: "rent",
              amenities: propertyData.amenities || [],
              features: [],
              images: propertyData.products?.images || ["/luxury-living-room.jpeg"],
              available: propertyData.is_available_for_booking,
              featured: true,
              booking_price_per_night: propertyData.booking_price_per_night,
              minimum_stay_nights: propertyData.minimum_stay_nights,
              is_available_for_booking: propertyData.is_available_for_booking,
            })
          } else {
            setError("Property not found")
          }
        }
      } catch (err) {
        console.error("Error fetching property:", err)
        setError("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const handleWishlistToggle = () => {
    if (!property) return

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
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Property link has been copied to clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The property you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/properties">Back to Properties</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-primary">
            Properties
          </Link>
          <span>/</span>
          <span className="text-foreground">{property.title}</span>
        </div>

        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Property Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={property.images[selectedImageIndex] || "/luxury-living-room.jpeg"}
                alt={property.title}
                fill
                className="object-cover"
              />
              {property.featured && <Badge className="absolute top-4 left-4">Featured</Badge>}
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? "border-primary" : "border-transparent"
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
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{property.address}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={isInWishlist(property.id) ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(property.id) ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{property.property_type}</Badge>
                <Badge variant="outline">{property.listing_type}</Badge>
                {property.available && <Badge className="bg-green-100 text-green-800">Available</Badge>}
              </div>

              <div className="text-3xl font-bold text-primary mb-4">
                ${property.price.toLocaleString()}
                {property.listing_type === "rent" && (
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                )}
                {property.booking_price_per_night && (
                  <span className="text-lg font-normal text-muted-foreground">/night</span>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bed className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.bedrooms}</div>
                <div className="text-sm text-muted-foreground">Bedrooms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Bath className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.bathrooms}</div>
                <div className="text-sm text-muted-foreground">Bathrooms</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Square className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="font-semibold">{property.area}</div>
                <div className="text-sm text-muted-foreground">Sq Ft</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <WhatsAppButton
                product={{
                  name: property.title,
                  price: property.price,
                  category: "Real Estate",
                }}
                className="w-full"
                size="lg"
              />
              {property.virtual_tour_url && (
                <Button variant="outline" className="w-full bg-transparent" asChild>
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

      <Footer />
    </div>
  )
}
