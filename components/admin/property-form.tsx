"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Upload, Save, Eye, Tag, MapPin, Home } from "lucide-react"
import { toast } from "sonner"
import { FileUpload } from "@/components/admin/file-upload"

interface PropertyFormProps {
  property?: any
  onSave: (property: any) => void
  onCancel: () => void
}

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    property_type: property?.property_type || "apartment",
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    booking_price_per_night: property?.booking_price_per_night || 0,
    location_details: property?.location_details || { address: "", city: "", country: "" },
    amenities: property?.amenities || [],
    images: property?.images || [],
    is_available_for_booking: property?.is_available_for_booking ?? true,
    status: property?.status || "available",
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newImage, setNewImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSave(formData)
    } catch (error) {
      toast.error("Failed to save property. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a: string) => a !== amenity),
    }))
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }))
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== image),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location & Amenities
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>
            <TabsContent value="basic" className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Luxury Downtown Apartment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, property_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the property features and highlights..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bedrooms: Number.parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bathrooms: Number.parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.booking_price_per_night}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, booking_price_per_night: Number.parseFloat(e.target.value) }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="booking_available">Available for Booking</Label>
                <Switch
                  id="booking_available"
                  checked={formData.is_available_for_booking}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_available_for_booking: checked }))
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-4">
              <div className="space-y-4">
                <Label>Location Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.location_details.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location_details: { ...prev.location_details, address: e.target.value },
                        }))
                      }
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.location_details.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location_details: { ...prev.location_details, city: e.target.value },
                        }))
                      }
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.location_details.country}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location_details: { ...prev.location_details, country: e.target.value },
                        }))
                      }
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Amenities</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity (e.g., WiFi, Pool, Gym)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity: string) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeAmenity(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6 mt-4">
              <div className="space-y-4">
                <Label>Property Images</Label>
                <FileUpload
                  multiple={true}
                  maxFiles={15}
                  initialFiles={formData.images}
                  onUpload={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      images: [...prev.images, url],
                    }))
                  }}
                  onDelete={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((img: string) => img !== url),
                    }))
                  }}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or enter image URL</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Paste image URL"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" onClick={addImage} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <Label className="mb-2 block">Current Images ({formData.images.length})</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Property ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(image)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t sticky bottom-0 bg-background">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : property ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
  )
}
