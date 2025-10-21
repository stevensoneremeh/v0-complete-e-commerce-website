"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Eye, MapPin, Users, Bed, Bath } from "lucide-react"
import { toast } from "sonner"

interface Property {
  id: string
  name: string
  description: string
  location: string
  bedrooms: number
  bathrooms: number
  max_guests: number
  price_per_night: number
  images: string[]
  amenities: string[]
  is_active: boolean
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
        setProperty(data.property || data)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/properties")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
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

      {/* Status */}
      <div className="flex gap-2">
        <Badge variant={property.is_active ? "default" : "destructive"}>
          {property.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Main Content */}
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
                    <p className="text-sm text-muted-foreground">Max Guests</p>
                  </div>
                  <p className="text-2xl font-bold">{property.max_guests}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Price/Night</p>
                  <p className="text-2xl font-bold">${property.price_per_night.toFixed(2)}</p>
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
