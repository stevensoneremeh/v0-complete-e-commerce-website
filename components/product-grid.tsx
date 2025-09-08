"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Heart, ShoppingCart, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useReviews } from "@/components/reviews-provider"
import { useToast } from "@/hooks/use-toast"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { createBrowserClient } from "@supabase/ssr"

const fallbackProducts = [
  {
    id: "perfume-sample-1",
    name: "Luxury French Perfume Collection",
    price: 89.99,
    originalPrice: 119.99 as number | null,
    image: "/placeholder.svg?height=300&width=300&text=Luxury+Perfume",
    badge: "Best Seller",
    inStock: true,
    category: "perfumes",
    brand: "chanel",
    description: "Exquisite collection of luxury French perfumes with long-lasting fragrance and elegant packaging.",
  },
  {
    id: "wig-sample-1",
    name: "Premium Human Hair Wig",
    price: 299.99,
    originalPrice: 399.99 as number | null,
    image: "/placeholder.svg?height=300&width=300&text=Premium+Wig",
    badge: "New",
    inStock: true,
    category: "wigs",
    brand: "premium",
    description: "High-quality human hair wig with natural look and comfortable fit for everyday wear.",
  },
  {
    id: "car-sample-1",
    name: "2023 Toyota Camry - Sale",
    price: 28999.99,
    originalPrice: 32999.99 as number | null,
    image: "/placeholder.svg?height=300&width=300&text=Toyota+Camry",
    badge: "Sale",
    inStock: true,
    category: "cars",
    brand: "toyota",
    description: "Reliable and fuel-efficient 2023 Toyota Camry with advanced safety features and modern technology.",
  },
  {
    id: "wine-sample-1",
    name: "Premium Red Wine Collection",
    price: 149.99,
    originalPrice: 199.99 as number | null,
    image: "/placeholder.svg?height=300&width=300&text=Premium+Wine",
    badge: "Popular",
    inStock: true,
    category: "wines",
    brand: "bordeaux",
    description: "Carefully selected premium red wines from renowned vineyards with rich flavor profiles.",
  },
  {
    id: "cream-sample-1",
    name: "Luxury Body Cream Set",
    price: 59.99,
    originalPrice: 79.99 as number | null,
    image: "/placeholder.svg?height=300&width=300&text=Body+Cream",
    badge: "Featured",
    inStock: true,
    category: "body-creams",
    brand: "luxury",
    description: "Nourishing luxury body cream set with natural ingredients for smooth and hydrated skin.",
  },
]

interface ProductGridProps {
  filters?: {
    categories: string[]
    brands: string[]
    priceRange: number[]
    rating: number[]
  }
  searchQuery?: string
}

export function ProductGrid({ filters, searchQuery }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [allProducts, setAllProducts] = useState(fallbackProducts)
  const [filteredProducts, setFilteredProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getProductRating } = useReviews()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("products")
          .select(`
            *,
            categories (
              name,
              slug
            )
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        if (data && !error) {
          const formattedProducts = data.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number.parseFloat(product.price),
            originalPrice: product.compare_at_price ? Number.parseFloat(product.compare_at_price) : null,
            image:
              product.images?.[0] || "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(product.name),
            badge: product.compare_at_price ? "Sale" : product.is_featured ? "Featured" : "New",
            inStock: product.stock_quantity > 0,
            category: product.categories?.slug || "general",
            brand: "premium", // Default brand since we don't have brands table yet
            description:
              product.short_description || product.description || "High-quality product with excellent features.",
            sku: product.sku,
          }))
          setAllProducts(formattedProducts)
        } else {
          console.error("Error fetching products:", error)
          // Keep fallback products
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        // Keep fallback products
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...allProducts]

    // Filter by search query
    if (searchQuery && searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)),
      )
    }

    if (filters) {
      // Filter by categories
      if (filters.categories.length > 0) {
        filtered = filtered.filter((product) => filters.categories.includes(product.category))
      }

      // Filter by brands
      if (filters.brands.length > 0) {
        filtered = filtered.filter((product) => filters.brands.includes(product.brand))
      }

      // Filter by price range
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        filtered = filtered.filter(
          (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
        )
      }

      // Filter by rating
      if (filters.rating.length > 0 && filters.rating[0] > 0) {
        filtered = filtered.filter((product) => {
          const { average } = getProductRating(product.id)
          return average >= filters.rating[0]
        })
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => {
          const ratingA = getProductRating(a.id).average
          const ratingB = getProductRating(b.id).average
          return ratingB - ratingA
        })
        break
      case "newest":
        filtered.reverse() // Since we already order by created_at desc
        break
      default:
        // Keep original order for featured
        break
    }

    setFilteredProducts(filtered)
  }, [filters, sortBy, searchQuery, getProductRating, allProducts])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        variant: "destructive",
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {allProducts.length} products
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"
          }
        >
          {filteredProducts.map((product) => {
            const { average: rating, count: reviewCount } = getProductRating(product.id)

            return (
              <Card
                key={product.id}
                className={`group hover:shadow-lg transition-all duration-300 ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <CardContent className={`p-0 ${viewMode === "list" ? "flex-shrink-0" : ""}`}>
                  <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-48 flex-shrink-0" : ""}`}>
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className={`object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer ${
                          viewMode === "list" ? "w-48 h-48" : "w-full h-64"
                        }`}
                      />
                    </Link>
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {product.badge}
                    </Badge>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isInWishlist(product.id) ? "text-red-500" : ""
                      }`}
                      onClick={() => handleWishlistToggle(product)}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    </Button>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center">
                          <Badge variant="destructive" className="mb-2">
                            Out of Stock
                          </Badge>
                          <p className="text-white text-xs">Add to wishlist</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {viewMode === "list" && (
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between h-full">
                        <div className="flex-1 min-w-0 pr-6">
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                              {product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground ml-2">
                              {reviewCount > 0 ? `(${reviewCount} reviews)` : "(No reviews)"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mb-3">
                            <DualCurrencyDisplay usdAmount={product.price} size="lg" variant="primary" compact={true} />
                            {product.originalPrice && product.originalPrice > product.price && (
                              <DualCurrencyDisplay
                                usdAmount={product.originalPrice}
                                size="md"
                                variant="muted"
                                compact={true}
                                className="line-through"
                              />
                            )}
                            {product.originalPrice && product.originalPrice > product.price && (
                              <Badge variant="destructive" className="text-xs">
                                Save ${(product.originalPrice - product.price).toFixed(2)}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {product.badge}
                            </Badge>
                            <div
                              className={`flex items-center text-xs px-2 py-1 rounded-full ${
                                product.inStock ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full mr-1 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-3 flex-shrink-0">
                          <Button
                            size="default"
                            disabled={!product.inStock}
                            onClick={() => handleAddToCart(product)}
                            className="min-w-[140px] h-10"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.inStock ? "Add to Cart" : "Out of Stock"}
                          </Button>
                          <WhatsAppButton
                            product={{
                              name: product.name,
                              price: product.price,
                              category: product.category,
                            }}
                            className="min-w-[140px] h-10"
                            variant="outline"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                {viewMode === "grid" && (
                  <>
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">
                          {reviewCount > 0 ? `(${reviewCount})` : "(0)"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <DualCurrencyDisplay usdAmount={product.price} size="md" variant="primary" compact={true} />
                          {product.originalPrice && product.originalPrice > product.price && (
                            <DualCurrencyDisplay
                              usdAmount={product.originalPrice}
                              size="sm"
                              variant="muted"
                              compact={true}
                              className="line-through"
                            />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    </div>
                    <CardFooter className="p-4 pt-0 space-y-2">
                      <Button className="w-full" disabled={!product.inStock} onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                      <WhatsAppButton
                        product={{
                          name: product.name,
                          price: product.price,
                          category: product.category,
                        }}
                        className="w-full"
                        variant="outline"
                      />
                    </CardFooter>
                  </>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
