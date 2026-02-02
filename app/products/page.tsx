"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { ProductSearch } from "@/components/product-search"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: number[]
  rating: number[]
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
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

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
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
      <main className="responsive-container py-12 sm:py-16 md:py-20">
        <div className="mb-10 sm:mb-12 md:mb-16">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-balance leading-tight">
                {searchQuery ? `Search: "${searchQuery}"` : "Premium Collection"}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl text-pretty">
                {searchQuery
                  ? `Showing results matching "${searchQuery}" across our luxury catalog`
                  : "Exclusive collection of perfumes, wigs, automobiles, wines, and skincare"}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="w-full sm:flex-1 max-w-lg">
                <ProductSearch onSearch={setSearchQuery} placeholder="Search products, categories, brands..." />
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={clearSearch} className="flex items-center gap-2 px-4 py-2 h-10 rounded-lg border-border hover:bg-secondary/50 whitespace-nowrap bg-transparent">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 lg:top-20">
              <ProductFilters onFiltersChange={handleFiltersChange} />
            </div>
          </aside>
          <div className="lg:col-span-4 order-1 lg:order-2">
            <ProductGrid filters={filters} searchQuery={searchQuery} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
