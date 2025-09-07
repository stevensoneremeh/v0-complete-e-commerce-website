"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  // Explicitly type filters state to match ProductFilters expected type
  const [filters, setFilters] = useState<{
    categories: string[]
    brands: string[]
    priceRange: number[]
    rating: number[]
  }>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    rating: [0],
  })

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get("search")
    if (query) {
      setSearchQuery(decodeURIComponent(query))
    }
  }, [searchParams])

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    // Update URL to remove search parameter
    window.history.pushState({}, "", "/products")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {searchQuery ? `Search Results for "${searchQuery}"` : "ABL Natasha Premium Collection"}
              </h1>
              <p className="text-muted-foreground">
                {searchQuery
                  ? `Showing products matching "${searchQuery}"`
                  : "Discover our exclusive collection of perfumes, luxury wigs, premium cars, fine wines, and body creams"}
              </p>
            </div>
            {searchQuery && (
              <Button variant="outline" onClick={clearSearch} className="flex items-center space-x-2 bg-transparent">
                <X className="h-4 w-4" />
                <span>Clear Search</span>
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters onFiltersChange={handleFiltersChange} />
          </aside>
          <div className="lg:col-span-3">
            <ProductGrid filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
