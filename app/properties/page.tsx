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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Luxury Properties
          </h1>
          <p className="text-muted-foreground text-lg">Discover premium apartments and luxury accommodations</p>
        </div>

        <PropertySearch onSearch={setSearchQuery} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-1">
            <PropertyFilters filters={filters} onFiltersChange={setFilters} />
          </div>
          <div className="lg:col-span-3">
            <PropertyGrid searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
