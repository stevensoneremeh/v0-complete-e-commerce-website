"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Car, Ship, Star } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface HireService {
  id: string
  name: string
  service_type: "car" | "boat"
  description: string
  image_url: string
  price: number
  duration: string
  capacity: string
  features: string[]
  rating: number
  reviews_count: number
  is_active: boolean
  sort_order: number
}

export default function HireServicesPage() {
  const [services, setServices] = useState<HireService[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<HireService | null>(null)
  const [filterType, setFilterType] = useState("all")
  
  const [formData, setFormData] = useState({
    name: "",
    service_type: "car" as "car" | "boat",
    description: "",
    image_url: "",
    price: 0,
    duration: "",
    capacity: "",
    features: [] as string[],
    rating: 0,
    reviews_count: 0,
    is_active: true,
    sort_order: 0,
  })
  const [featureInput, setFeatureInput] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/hire-services")
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
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
        }
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

  const handleEdit = (service: HireService) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      service_type: service.service_type,
      description: service.description || "",
      image_url: service.image_url || "",
      price: service.price,
      duration: service.duration || "",
      capacity: service.capacity || "",
      features: service.features || [],
      rating: service.rating || 0,
      reviews_count: service.reviews_count || 0,
      is_active: service.is_active,
      sort_order: service.sort_order || 0,
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
      service_type: "car",
      description: "",
      image_url: "",
      price: 0,
      duration: "",
      capacity: "",
      features: [],
      rating: 0,
      reviews_count: 0,
      is_active: true,
      sort_order: 0,
    })
    setFeatureInput("")
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const filteredServices = services.filter(
    (service) => filterType === "all" || service.service_type === filterType
  )

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Hire Services</h1>
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
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                              <Image
                                src={service.image_url || "/placeholder.jpg"}
                                alt={service.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>
                            <Badge variant={service.service_type === "car" ? "default" : "secondary"}>
                              {service.service_type === "car" ? (
                                <Car className="h-3 w-3 mr-1" />
                              ) : (
                                <Ship className="h-3 w-3 mr-1" />
                              )}
                              {service.service_type}
                            </Badge>
                          </TableCell>
                          <TableCell>${service.price.toFixed(2)}</TableCell>
                          <TableCell>{service.duration}</TableCell>
                          <TableCell>{service.capacity}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{service.rating}</span>
                              <span className="text-muted-foreground">({service.reviews_count})</span>
                            </div>
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(service.id)}
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

            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Service Name*</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="service_type">Service Type*</Label>
                      <Select
                        value={formData.service_type}
                        onValueChange={(value: "car" | "boat") =>
                          setFormData({ ...formData, service_type: value })
                        }
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
                    <div>
                      <Label htmlFor="price">Price*</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration*</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., per day, 3 hours"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity*</Label>
                      <Input
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="e.g., 4 passengers"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sort_order">Sort Order</Label>
                      <Input
                        id="sort_order"
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      />
                    </div>
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
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="/path-to-image.jpg"
                    />
                  </div>
                  <div>
                    <Label>Features</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        placeholder="Add a feature"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                      />
                      <Button type="button" onClick={addFeature}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-2 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviews_count">Reviews Count</Label>
                      <Input
                        id="reviews_count"
                        type="number"
                        value={formData.reviews_count}
                        onChange={(e) =>
                          setFormData({ ...formData, reviews_count: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="is_active">Active (visible to customers)</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
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
        </main>
      </div>
    </div>
  )
}
