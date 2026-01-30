"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Eye, MapPin, Users, Bed, Bath } from "lucide-react"
import { toast } from "sonner"
import { splitPropertyMedia } from "@/lib/property-media"

interface Property {
  id: string
  title: string
  description: string
  location: string
  bedrooms: number
  bathrooms: number
  booking_price_per_night: number
  images: string[]
  videos: string[]
  amenities: string[]
  is_available_for_booking?: boolean
  status?: string
  created_at: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperty()
  }, [propertyId])

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`)
      if (response.ok) {
        const data = await response.json()
        const raw = data.property || data
        const media = splitPropertyMedia(raw.images || raw.products?.images)
        setProperty({
          ...raw,
          title: raw.title || raw.products?.name || "Property",
          description: raw.description || raw.products?.description || "",
          booking_price_per_night: Number(raw.booking_price_per_night ?? raw.products?.price ?? 0),
          images: media.images,
          videos: media.videos,
        })
      } else {
        toast.error("Property not found")
        router.push("/admin/properties")
      }
    } catch (error) {
      toast.error("Failed to fetch property")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Property deleted successfully")
          router.push("/admin/properties")
        }
      } catch (error) {
        toast.error("Failed to delete property")
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading property...</div>
  }

  if (!property) {
    return <div className="text-center py-12">Property not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/properties")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {property.location}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(`/properties/${property.id}`, "_blank")}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/properties/${property.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant={property.is_available_for_booking ? "default" : "secondary"}>
          {property.is_available_for_booking ? "Available" : "Unavailable"}
        </Badge>
        {property.status && <Badge variant="outline">{property.status}</Badge>}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </div>
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                  </div>
                  <p className="text-2xl font-bold">{property.bathrooms}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Est. Guests</p>
                  </div>
                  <p className="text-2xl font-bold">{Math.max(1, (property.bedrooms || 1) * 2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price/Night</p>
                  <p className="text-2xl font-bold">${property.booking_price_per_night.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{property.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Property ${index + 1}`}
                    className="w-full h-48 object-cover rounded border"
                  />
                ))}
              </div>
              {property.videos.length > 0 && (
                <div className="mt-6">
                  <CardTitle className="text-base mb-3">Videos</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.videos.map((video, index) => (
                      <video key={index} src={video} controls className="w-full h-48 rounded border object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="amenities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-primary">✓</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No bookings yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
      </Tabs>
