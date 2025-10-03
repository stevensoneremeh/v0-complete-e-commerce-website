"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyForm } from "@/components/admin/property-form"
import { Plus, Edit, Trash2, Eye, Building2, Search, Filter, MapPin } from "lucide-react"
import { toast } from "sonner"

interface Property {
  id: string
  title: string
  description: string
  property_type: string
  bedrooms: number
  bathrooms: number
  booking_price_per_night: number
  location_details: {
    address: string
    city: string
    country: string
  }
  status: string
  images: string[]
  amenities: string[]
  is_available_for_booking: boolean
  created_at: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      if (response.ok) {
        const data = await response.json()
        setProperties(data || [])
      }
    } catch (error) {
      toast.error("Failed to fetch properties")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (propertyData: any) => {
    try {
      const response = await fetch(
        editingProperty ? `/api/admin/properties/${editingProperty.id}` : "/api/admin/properties",
        {
          method: editingProperty ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(propertyData)
        }
      )

      if (response.ok) {
        await fetchProperties()
        setShowForm(false)
        setEditingProperty(null)
        toast.success(`Property ${editingProperty ? "updated" : "created"} successfully`)
      }
    } catch (error) {
      toast.error("Failed to save property")
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleDelete = async (propertyId: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await fetch(`/api/admin/properties/${propertyId}`, {
          method: "DELETE"
        })

        if (response.ok) {
          await fetchProperties()
          toast.success("Property deleted successfully")
        }
      } catch (error) {
        toast.error("Failed to delete property")
      }
    }
  }

  const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchProperties()
        toast.success(`Property status updated to ${newStatus}`)
      }
    } catch (error) {
      toast.error("Failed to update property status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "booked":
        return "bg-blue-100 text-blue-800"
      case "sold":
        return "bg-purple-100 text-purple-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location_details?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || property.status === filterStatus
    const matchesType = filterType === "all" || property.property_type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Property Management</h1>
                <p className="text-muted-foreground">Manage luxury apartment listings</p>
              </div>
              <Button onClick={() => {
                setEditingProperty(null)
                setShowForm(true)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
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
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
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
                </div>
              </CardContent>
            </Card>

            {/* Properties Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Properties ({filteredProperties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading properties...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Price/Night</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            {property.images?.[0] ? (
                              <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{property.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {property.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {property.property_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {property.location_details?.city}, {property.location_details?.country}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{property.bedrooms} bed, {property.bathrooms} bath</div>
                              <div className="text-muted-foreground">
                                {property.amenities?.length || 0} amenities
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${property.booking_price_per_night}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(property.status)}>
                                {property.status}
                              </Badge>
                              {property.is_available_for_booking && (
                                <Badge variant="secondary">Bookable</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(property)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Select
                                value={property.status}
                                onValueChange={(value) => updatePropertyStatus(property.id, value)}
                              >
                                <SelectTrigger className="w-32">
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(property.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Property Form Dialog */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <PropertyForm
                  property={editingProperty}
                  onSave={handleSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
