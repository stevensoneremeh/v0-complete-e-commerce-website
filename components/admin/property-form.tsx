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

interface PropertyFormData {
  title: string
  description: string
  property_type: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  booking_price_per_night: number
  location_details: { address: string; city: string; country: string }
  amenities: string[]
  images: string[]
  is_available_for_booking: boolean
  minimum_stay_nights: number
  year_built: number
  lot_size: number
  virtual_tour_url: string
  floor_plans: string[]
  status: string
  tags: string[]
  meta_title: string
  meta_description: string
  featured: boolean
}

interface PropertyFormProps {
  property?: (Partial<PropertyFormData> & { id?: string }) | null
  onSave: (property: any) => void
  onCancel: () => void
}

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || "",
    description: property?.description || "",
    property_type: property?.property_type || "apartment",
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    square_feet: property?.square_feet || 0,
    booking_price_per_night: property?.booking_price_per_night || 0,
    location_details: property?.location_details || { address: "", city: "", country: "" },
    amenities: property?.amenities || [],
    images: property?.images || [],
    is_available_for_booking: property?.is_available_for_booking ?? true,
    minimum_stay_nights: property?.minimum_stay_nights || 1,
    year_built: property?.year_built || new Date().getFullYear(),
    lot_size: property?.lot_size || 0,
    virtual_tour_url: property?.virtual_tour_url || "",
    floor_plans: property?.floor_plans || [],
    status: property?.status || "available",
    tags: property?.tags || [],
    meta_title: property?.meta_title || "",
    meta_description: property?.meta_description || "",
    featured: property?.featured || false,
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newImage, setNewImage] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/properties", {
        method: property ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: property?.id }),
      })

      if (response.ok) {
        const savedProperty = await response.json()
        onSave(savedProperty)
        toast.success(`Property ${property ? "updated" : "created"} successfully!`)
      } else {
        throw new Error("Failed to save property")
      }
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag),
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
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          {property ? "Edit Property" : "Add New Property"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Management
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-6">
            {/* BASIC TAB */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
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
                <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    min="0"
                    value={formData.square_feet}
                    onChange={(e) => setFormData((prev) => ({ ...prev, square_feet: Number.parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Night ($)</Label>
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
              </div>
            </TabsContent>

            {/* DETAILS TAB */}
            <TabsContent value="details" className="space-y-6">
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
                        }))}
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
                        }))}
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
                  {formData.amenities.map((amenity) => (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year_built">Year Built</Label>
                  <Input
                    id="year_built"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear() + 5}
                    value={formData.year_built}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year_built: Number.parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_stay">Minimum Stay (nights)</Label>
                  <Input
                    id="minimum_stay"
                    type="number"
                    min="1"
                    value={formData.minimum_stay_nights}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, minimum_stay_nights: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="virtual_tour">Virtual Tour URL</Label>
                  <Input
                    id="virtual_tour"
                    type="url"
                    value={formData.virtual_tour_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, virtual_tour_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </TabsContent>

            {/* MEDIA TAB */}
            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <Label>Property Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Image URL"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" onClick={addImage} size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
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

              <div className="space-y-4">
                <Label>SEO & Meta Information</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO description for search engines"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* MANAGEMENT TAB */}
            <TabsContent value="management" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Property Status</Label>
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
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Property</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_available">Available for Booking</Label>
                    <Switch
                      id="is_available"
                      checked={formData.is_available_for_booking}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, is_available_for_booking: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : property ? "Update Property" : "Create Property"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
