"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface Filters {
  priceRange: number[]
  bedrooms: string
  propertyType: string
  amenities: string[]
}

interface PropertyFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const amenitiesList = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Kitchen",
  "Balcony",
  "Air Conditioning",
  "Heating",
  "Washer/Dryer",
  "Pet Friendly",
  "Beach Access",
  "Hot Tub",
  "Workspace",
  "Rooftop",
]

export function PropertyFilters({ filters, onFiltersChange }: PropertyFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: value })
  }

  const handleBedroomsChange = (value: string) => {
    onFiltersChange({ ...filters, bedrooms: value })
  }

  const handlePropertyTypeChange = (value: string) => {
    onFiltersChange({ ...filters, propertyType: value })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const updatedAmenities = checked ? [...filters.amenities, amenity] : filters.amenities.filter((a) => a !== amenity)
    onFiltersChange({ ...filters, amenities: updatedAmenities })
  }

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 1000],
      bedrooms: "",
      propertyType: "",
      amenities: [],
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 premium-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range (per night)</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Bedrooms</Label>
            <Select value={filters.bedrooms || "any"} onValueChange={handleBedroomsChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3">3 Bedrooms</SelectItem>
                <SelectItem value="4">4+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Property Type</Label>
            <Select value={filters.propertyType || "any"} onValueChange={handlePropertyTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
                <SelectItem value="beachfront">Beachfront</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Amenities</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full border-primary/20 hover:border-primary/40 bg-transparent"
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
