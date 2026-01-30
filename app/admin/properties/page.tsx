"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PropertyForm } from "@/components/admin/property-form"
import { Plus, Edit, Trash2, Building2, Search, Filter, MapPin, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { splitPropertyMedia } from "@/lib/property-media"

interface Property {
  id: string
  title: string
  description: string
  location: string
  bedrooms: number
  bathrooms: number
  booking_price_per_night: number
  status: string
  images: string[]
  amenities: string[]
  property_type?: string
  is_available_for_booking?: boolean
  created_at: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/admin/properties")
      if (response.ok) {
        const data = await response.json()
        const raw = Array.isArray(data) ? data : data.properties || []
        const mapped = raw.map((item: any) => {
          const media = splitPropertyMedia(item.images || item.products?.images)
          return {
            ...item,
            title: item.title || item.products?.name || "Untitled Property",
            description: item.description || item.products?.description || "",
            booking_price_per_night: Number(item.booking_price_per_night ?? item.products?.price ?? 0),
            images: media.images,
          }
        })
        setProperties(mapped)
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
          body: JSON.stringify(propertyData),
        },
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
          method: "DELETE",
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

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || property.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Management</h1>
          <p className="text-muted-foreground">Manage your properties</p>
        </div>
        <Button
          onClick={() => {
            setEditingProperty(null)
            setShowForm(true)
          }}
        >
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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
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
                  <TableHead>Location</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Guests</TableHead>
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
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                        <div>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {property.bedrooms} bed, {property.bathrooms} bath
                          </div>
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {property.location}
                      </div>
                    </TableCell>
                    <TableCell>${property.booking_price_per_night.toFixed(2)}</TableCell>
                    <TableCell>{Math.max(1, (property.bedrooms || 1) * 2)} guests</TableCell>
                    <TableCell>
                      <Badge variant={property.status === "available" ? "default" : "secondary"}>
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/properties/${property.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(property)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(property.id)}>
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
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProperty ? "Edit Property" : "Add New Property"}</DialogTitle>
          </DialogHeader>
          <PropertyForm property={editingProperty} onSave={handleSubmit} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
