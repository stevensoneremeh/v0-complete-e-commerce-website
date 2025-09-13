"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface SearchResult {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface ProductSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function ProductSearch({ onSearch, placeholder = "Search products...", className = "" }: ProductSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches] = useState(["Luxury Perfumes", "Human Hair Wigs", "Toyota Cars", "Premium Wines"])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            price,
            images,
            categories (
              name,
              slug
            )
          `)
          .eq("is_active", true)
          .ilike("name", `%${query}%`)
          .limit(5)

        if (data && !error) {
          const searchResults: SearchResult[] = data.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number.parseFloat(product.price),
            image:
              product.images?.[0] || "/placeholder.svg?height=60&width=60&text=" + encodeURIComponent(product.name),
            category: product.categories?.name || "General",
          }))
          setResults(searchResults)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      // Navigate to products page with search
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
      setQuery("")

      if (onSearch) {
        onSearch(searchQuery)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:border-primary/50"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setQuery("")
              setResults([])
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Search Results */}
            {query.length >= 2 && (
              <div className="border-b border-border/50">
                <div className="p-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h4>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-2">
                          <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                          <div className="flex-1 space-y-1">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-1">
                      {results.map((result) => (
                        <Link
                          key={result.id}
                          href={`/products/${result.id}`}
                          className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <Image
                            src={result.image || "/placeholder.svg"}
                            alt={result.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{result.name}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-primary font-medium">${result.price}</p>
                              <Badge variant="secondary" className="text-xs">
                                {result.category}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-primary"
                        onClick={() => handleSearch(query)}
                      >
                        View all results for "{query}"
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No products found</p>
                  )}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length < 2 && (
              <div className="border-b border-border/50">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Recent Searches
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {query.length < 2 && (
              <div className="p-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trending Searches
                </h4>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
