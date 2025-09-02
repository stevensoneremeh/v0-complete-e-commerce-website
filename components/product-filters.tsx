"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const categories = [
  { id: "electronics", name: "Electronics", count: 150 },
  { id: "fashion", name: "Fashion", count: 300 },
  { id: "home", name: "Home & Garden", count: 200 },
  { id: "sports", name: "Sports", count: 120 },
  { id: "books", name: "Books", count: 80 },
  { id: "beauty", name: "Beauty", count: 90 },
]

const brands = [
  { id: "apple", name: "Apple", count: 45 },
  { id: "samsung", name: "Samsung", count: 38 },
  { id: "nike", name: "Nike", count: 52 },
  { id: "adidas", name: "Adidas", count: 41 },
  { id: "sony", name: "Sony", count: 29 },
]

interface ProductFiltersProps {
  onFiltersChange?: (filters: {
    categories: string[]
    brands: string[]
    priceRange: number[]
    rating: number[]
  }) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [rating, setRating] = useState([0])

  // Notify parent component when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        categories: selectedCategories,
        brands: selectedBrands,
        priceRange,
        rating,
      })
    }
  }, [selectedCategories, selectedBrands, priceRange, rating]) // Remove onFiltersChange from dependencies

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId])
    } else {
      setSelectedBrands(selectedBrands.filter((id) => id !== brandId))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 1000])
    setRating([0])
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (rating[0] > 0 ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters ({activeFiltersCount})</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find((c) => c.id === categoryId)
                return (
                  <Badge key={categoryId} variant="secondary" className="cursor-pointer">
                    {category?.name}
                    <X className="h-3 w-3 ml-1" onClick={() => handleCategoryChange(categoryId, false)} />
                  </Badge>
                )
              })}
              {selectedBrands.map((brandId) => {
                const brand = brands.find((b) => b.id === brandId)
                return (
                  <Badge key={brandId} variant="secondary" className="cursor-pointer">
                    {brand?.name}
                    <X className="h-3 w-3 ml-1" onClick={() => handleBrandChange(brandId, false)} />
                  </Badge>
                )
              })}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="cursor-pointer">
                  ${priceRange[0]} - ${priceRange[1]}
                  <X className="h-3 w-3 ml-1" onClick={() => setPriceRange([0, 1000])} />
                </Badge>
              )}
              {rating[0] > 0 && (
                <Badge variant="secondary" className="cursor-pointer">
                  {rating[0]}+ Stars
                  <X className="h-3 w-3 ml-1" onClick={() => setRating([0])} />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {category.name}
              </label>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
          <div className="flex items-center justify-between text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={brand.id}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
              />
              <label
                htmlFor={brand.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {brand.name}
              </label>
              <span className="text-xs text-muted-foreground">({brand.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider value={rating} onValueChange={setRating} max={5} step={1} className="w-full" />
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Any</span>
            <span>{rating[0]} Stars & Up</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
