"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyForm } from "@/components/admin/property-form"
import { Plus, Search, Edit, Trash2, Eye, Building2, MapPin, DollarSign, Filter } from "lucide-react"
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
  status: "available" | "booked" | "sold" | "maintenance" | "draft"
  tags: string[]
  last_updated: string
  product?: {
    id: string
    name: string
    slug: string
    images: string[]
    price: number
    status: string
  }
}

interface PropertyFormData {
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
  tags: string[]
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location_details?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((property) => property.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((property) => property.property_type === typeFilter)
    }

    setFilteredProperties(filtered)
  }, [properties, searchTerm, statusFilter, typeFilter])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      if (response.ok) {
        const data = await response.json()
        const propertiesWithDefaults = data.map((property: any) => ({
          ...property,
          status: property.status || "available",
          tags: property.tags || [],
          last_updated: property.updated_at || property.created_at,
        }))
        setProperties(propertiesWithDefaults)
      } else {
        toast.error("Failed to fetch properties")
      }
    } catch (error) {
      toast.error("Error loading properties")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (propertyId: string, newStatus: Property["status"]) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId ? { ...p, status: newStatus, last_updated: new Date().toISOString() } : p,
          ),
        )
        toast.success(`Property status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Error updating status")
    }
  }

  const handleSaveProperty = (savedProperty: PropertyFormData & { id?: string }) => {
    const now = new Date().toISOString()

    if (editingProperty) {
      // Update existing property
      setProperties((prev) =>
        prev.map((p) =>
          p.id === savedProperty.id
            ? ({
                ...savedProperty,
                id: savedProperty.id!,
                created_at: p.created_at,
                last_updated: now,
              } as Property)
            : p,
        ),
      )
    } else {
      // Add new property
      const newProperty: Property = {
        ...savedProperty,
        id: savedProperty.id || globalThis.crypto.randomUUID(),
        created_at: now,
        last_updated: now,
        status: "available", // Default status for new properties
      }
      setProperties((prev) => [newProperty, ...prev])
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

  const getStatusBadgeVariant = (status: Property["status"]) => {
    switch (status) {
      case "available":
        return "default"
      case "booked":
        return "secondary"
      case "sold":
        return "destructive"
      case "maintenance":
        return "outline"
      case "draft":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "available":
        return "text-green-600"
      case "booked":
        return "text-blue-600"
      case "sold":
        return "text-red-600"
      case "maintenance":
        return "text-orange-600"
      case "draft":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
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

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search properties, types, locations, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {properties.filter((p) => p.status === "available").length}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {properties.filter((p) => p.status === "booked").length}
            </div>
            <div className="text-sm text-muted-foreground">Booked</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {properties.filter((p) => p.status === "sold").length}
            </div>
            <div className="text-sm text-muted-foreground">Sold</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {properties.filter((p) => p.status === "maintenance").length}
            </div>
            <div className="text-sm text-muted-foreground">Maintenance</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{properties.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
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
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={getStatusBadgeVariant(property.status)} className={getStatusColor(property.status)}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-white/90">
                      {property.property_type}
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

                    {property.tags && property.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {property.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {property.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex gap-2">
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

                      <Select
                        value={property.status}
                        onValueChange={(value: Property["status"]) => handleStatusUpdate(property.id, value)}
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
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
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
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
