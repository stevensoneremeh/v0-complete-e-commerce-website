"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Car, Ship, Star, Upload as UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { FileUpload } from "@/components/admin/file-upload"

interface HireItem {
  id: string
  name: string
  slug: string
  category: string
  description: string
  image_url: string
  price_per_day: number
  images: string[]
  is_available: boolean
  is_active: boolean
  rating: number
  review_count: number
}

export default function HireServicesPage() {
  const [services, setServices] = useState<HireItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<HireItem | null>(null)
  const [filterType, setFilterType] = useState("all")

  const [formData, setFormData] = useState({
    name: "",
    category: "car",
    description: "",
    image_url: "",
    price_per_day: 0,
    is_available: true,
    is_active: true,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/hire-services")
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || data || [])
      }
    } catch (error) {
      toast.error("Failed to fetch hire services")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(
        editingService ? `/api/admin/hire-services/${editingService.id}` : "/api/admin/hire-services",
        {
          method: editingService ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      )

      if (response.ok) {
        await fetchServices()
        setShowForm(false)
        setEditingService(null)
        resetForm()
        toast.success(`Service ${editingService ? "updated" : "created"} successfully`)
      }
    } catch (error) {
      toast.error("Failed to save service")
    }
  }

  const handleEdit = (service: HireItem) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      category: service.category || "car",
      description: service.description || "",
      image_url: service.image_url || "",
      price_per_day: service.price_per_day,
      is_available: service.is_available,
      is_active: service.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this hire service?")) {
      try {
        const response = await fetch(`/api/admin/hire-services/${serviceId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchServices()
          toast.success("Service deleted successfully")
        }
      } catch (error) {
        toast.error("Failed to delete service")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      category: "car",
      description: "",
      image_url: "",
      price_per_day: 0,
      is_available: true,
      is_active: true,
    })
  }

  const filteredServices = services.filter((service) => filterType === "all" || service.category === filterType)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hire Items Management</h1>
          <p className="text-muted-foreground">Manage luxury car hire and boat cruise services</p>
        </div>
        <Button
          onClick={() => {
            setEditingService(null)
            resetForm()
            setShowForm(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="car">Car Hire</SelectItem>
              <SelectItem value="boat">Boat Cruises</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading services...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      {service.image_url ? (
                        <img
                          src={service.image_url || "/placeholder.svg"}
                          alt={service.name}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                          {service.category === "car" ? (
                            <Car className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Ship className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>
                      <Badge variant={service.category === "car" ? "default" : "secondary"}>
                        {service.category === "car" ? (
                          <Car className="h-3 w-3 mr-1" />
                        ) : (
                          <Ship className="h-3 w-3 mr-1" />
                        )}
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>${service.price_per_day.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span className="text-muted-foreground">({service.review_count})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_available ? "default" : "secondary"}>
                        {service.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car Hire</SelectItem>
                    <SelectItem value="boat">Boat Cruise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="price_per_day">Price Per Day *</Label>
              <Input
                id="price_per_day"
                type="number"
                step="0.01"
                value={formData.price_per_day}
                onChange={(e) => setFormData({ ...formData, price_per_day: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <Label>Service Image</Label>
              <FileUpload
                multiple={false}
                maxFiles={1}
                initialFiles={formData.image_url ? [formData.image_url] : []}
                onUpload={(url) => {
                  setFormData({ ...formData, image_url: url })
                }}
                onDelete={() => {
                  setFormData({ ...formData, image_url: "" })
                }}
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or enter URL</span>
                </div>
              </div>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="Or paste image URL"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url || "/placeholder.svg"}
                    alt="Service preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_available">Available for Booking</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingService(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editingService ? "Update Service" : "Create Service"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
