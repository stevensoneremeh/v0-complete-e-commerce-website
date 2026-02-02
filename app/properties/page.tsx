"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertySearch } from "@/components/property-search"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyGrid } from "@/components/property-grid"

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    bedrooms: "",
    propertyType: "",
    amenities: [] as string[],
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="responsive-container py-12 sm:py-16 md:py-20">
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-balance leading-tight">
            Luxury Properties
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl text-pretty">
            Discover our curated collection of premium apartments and luxury accommodations for your perfect stay
          </p>
        </div>

        <div className="mb-8 sm:mb-10">
          <PropertySearch onSearch={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 lg:top-20">
              <PropertyFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>
          <div className="lg:col-span-4 order-1 lg:order-2">
            <PropertyGrid searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
