"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PropertyForm } from "@/components/admin/property-form"
import { Plus, Search, Edit, Trash2, Eye, Building2, MapPin, DollarSign } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Property {
  id: string
  title: string
  description: string
  property_type: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  booking_price_per_night: number
  location_details: any
  amenities: string[]
  images: string[]
  is_available_for_booking: boolean
  minimum_stay_nights: number
  year_built: number
  created_at: string
  product?: {
    id: string
    name: string
    slug: string
    images: string[]
    price: number
    status: string
  }
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    const filtered = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location_details?.city?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProperties(filtered)
  }, [properties, searchTerm])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      } else {
        toast.error("Failed to fetch properties")
      }
    } catch (error) {
      toast.error("Error loading properties")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProperty = (savedProperty: Property) => {
    if (editingProperty) {
      setProperties((prev) => prev.map((p) => (p.id === savedProperty.id ? savedProperty : p)))
    } else {
      setProperties((prev) => [savedProperty, ...prev])
    }
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId))
        toast.success("Property deleted successfully")
      } else {
        toast.error("Failed to delete property")
      }
    } catch (error) {
      toast.error("Error deleting property")
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <PropertyForm property={editingProperty} onSave={handleSaveProperty} onCancel={handleCancelForm} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Property Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage luxury apartment listings and bookings</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Property
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={property.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={property.is_available_for_booking ? "default" : "secondary"}>
                      {property.is_available_for_booking ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location_details?.city || "Location not specified"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.square_feet} sq ft</span>
                    </div>

                    <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                      <DollarSign className="h-4 w-4" />
                      {property.booking_price_per_night}/night
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {property.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{property.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProperty(property)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/properties/${property.id}`, "_blank")}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No properties match your search criteria."
                    : "Get started by adding your first property."}
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
