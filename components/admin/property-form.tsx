
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
import { X, Plus, Upload, Save, Eye, Tag, MapPin, Home, Video, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"

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
    square_feet: property?.square_feet || 0,
    booking_price_per_night: property?.booking_price_per_night || 0,
    location_details: property?.location_details || { address: "", city: "", state: "", country: "Nigeria" },
    amenities: property?.amenities || [],
    images: property?.images || [],
    videos: property?.videos || [],
    is_available_for_booking: property?.is_available_for_booking ?? true,
    minimum_stay_nights: property?.minimum_stay_nights || 1,
    max_guests: property?.max_guests || 2,
    year_built: property?.year_built || new Date().getFullYear(),
    lot_size: property?.lot_size || 0,
    virtual_tour_url: property?.virtual_tour_url || "",
    status: property?.status || "available",
    tags: property?.tags || [],
    meta_title: property?.meta_title || "",
    meta_description: property?.meta_description || "",
    is_featured: property?.is_featured || false,
    cleaning_fee: property?.cleaning_fee || 0,
    security_deposit: property?.security_deposit || 0,
    price_per_month: property?.price_per_month || 0,
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const handleFileUpload = async (files: FileList, type: 'images' | 'videos'): Promise<string[]> => {
    setUploadingFiles(true)
    const uploadedUrls: string[] = []
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (type === 'images' && !file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`)
          continue
        }
        if (type === 'videos' && !file.type.startsWith('video/')) {
          toast.error(`${file.name} is not a valid video file`)
          continue
        }
        
        // For production, implement proper file upload to storage bucket
        // For now, we'll use placeholder URLs
        const fileName = `property-${Date.now()}-${i}-${file.name}`
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        uploadedUrls.push(`/uploads/properties/${type}/${fileName}`)
      }
      
      return uploadedUrls
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload files")
      return []
    } finally {
      setUploadingFiles(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const uploadedUrls = await handleFileUpload(files, 'images')
    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
      toast.success(`${uploadedUrls.length} images uploaded successfully`)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const uploadedUrls = await handleFileUpload(files, 'videos')
    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), ...uploadedUrls]
      }))
      toast.success(`${uploadedUrls.length} videos uploaded successfully`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(property ? `/api/admin/properties/${property.id}` : "/api/admin/properties", {
        method: property ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedProperty = await response.json()
        onSave(savedProperty)
        toast.success(`Property ${property ? "updated" : "created"} successfully!`)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save property")
      }
    } catch (error: any) {
      console.error("Save error:", error)
      toast.error(error.message || "Failed to save property. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: (prev.videos || []).filter((_, i) => i !== index)
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
              Details & Location
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Media & Files
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Management
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-6">
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Luxury Downtown Apartment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}
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
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    min="0"
                    value={formData.square_feet}
                    onChange={(e) => setFormData(prev => ({ ...prev, square_feet: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_guests">Max Guests</Label>
                  <Input
                    id="max_guests"
                    type="number"
                    min="1"
                    value={formData.max_guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_per_night">Price per Night ($) *</Label>
                  <Input
                    id="price_per_night"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.booking_price_per_night}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      booking_price_per_night: parseFloat(e.target.value) 
                    }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_month">Price per Month ($)</Label>
                  <Input
                    id="price_per_month"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_month}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      price_per_month: parseFloat(e.target.value) 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cleaning_fee">Cleaning Fee ($)</Label>
                  <Input
                    id="cleaning_fee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cleaning_fee}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      cleaning_fee: parseFloat(e.target.value) 
                    }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Location Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.location_details.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location_details: { ...prev.location_details, address: e.target.value }
                      }))}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.location_details.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location_details: { ...prev.location_details, city: e.target.value }
                      }))}
                      placeholder="Lagos, Abuja, etc."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.location_details.state}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location_details: { ...prev.location_details, state: e.target.value }
                      }))}
                      placeholder="Lagos State, FCT, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.location_details.country}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location_details: { ...prev.location_details, country: e.target.value }
                      }))}
                      placeholder="Nigeria"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Amenities</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year_built">Year Built</Label>
                  <Input
                    id="year_built"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear() + 5}
                    value={formData.year_built}
                    onChange={(e) => setFormData(prev => ({ ...prev, year_built: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_stay">Minimum Stay (nights)</Label>
                  <Input
                    id="minimum_stay"
                    type="number"
                    min="1"
                    value={formData.minimum_stay_nights}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      minimum_stay_nights: parseInt(e.target.value) 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="virtual_tour">Virtual Tour URL</Label>
                  <Input
                    id="virtual_tour"
                    type="url"
                    value={formData.virtual_tour_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, virtual_tour_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  <Label className="text-lg font-semibold">Property Images</Label>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingFiles}
                      className="flex-1"
                    />
                    <Button type="button" disabled={uploadingFiles} size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingFiles ? "Uploading..." : "Upload Images"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <Label className="text-lg font-semibold">Property Videos</Label>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoUpload}
                      disabled={uploadingFiles}
                      className="flex-1"
                    />
                    <Button type="button" disabled={uploadingFiles} size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingFiles ? "Uploading..." : "Upload Videos"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData.videos || []).map((video: string, index: number) => (
                      <div key={index} className="relative group">
                        <video
                          src={video}
                          className="w-full h-32 object-cover rounded-lg border"
                          controls
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeVideo(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">SEO & Meta Information</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="SEO description for search engines"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Property Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
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
                  <Label className="text-lg font-semibold">Settings</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured Property</Label>
                      <Switch
                        id="featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="booking_available">Available for Booking</Label>
                      <Switch
                        id="booking_available"
                        checked={formData.is_available_for_booking}
                        onCheckedChange={(checked) => setFormData(prev => ({ 
                          ...prev, 
                          is_available_for_booking: checked 
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Property Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag (e.g., luxury, waterfront, pet-friendly)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Tags help categorize and filter properties. Use descriptive keywords.
                </p>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || uploadingFiles}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : uploadingFiles ? "Uploading..." : "Save Property"}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
