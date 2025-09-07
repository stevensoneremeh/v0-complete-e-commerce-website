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

interface LocationDetails {
  address: string
  city: string
  country: string
}

interface PropertyFormData {
  title: string
  description: string
  property_type: string
  bedrooms: number
  bathrooms: number
  square_feet: number
  booking_price_per_night: number
  location_details: LocationDetails
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
  property?: Partial<PropertyFormData> & { id?: string }
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            {/* unchanged JSX structure — all inputs remain the same */}
            {/* (I only updated filter/map callbacks and event handler types above) */}

            {/* ... rest of the JSX identical to what you pasted ... */}

          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
