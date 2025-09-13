"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useReviews } from "@/components/reviews-provider"
import { useToast } from "@/hooks/use-toast"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  badge?: string
  inStock: boolean
}

interface ProductRecommendationsProps {
  currentProductId?: string
  category?: string
  title?: string
  limit?: number
}

export function ProductRecommendations({
  currentProductId,
  category,
  title = "You might also like",
  limit = 4,
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getProductRating } = useReviews()
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        let query = supabase
          .from("products")
          .select(`
            id,
            name,
            price,
            compare_at_price,
            images,
            stock_quantity,
            is_featured,
            categories (
              name,
              slug
            )
          `)
          .eq("is_active", true)
          .limit(limit)

        // If we have a current product, exclude it
        if (currentProductId) {
          query = query.neq("id", currentProductId)
        }

        // If we have a category, prioritize products from the same category
        if (category) {
          const { data: categoryProducts } = await query.eq("categories.slug", category).limit(Math.ceil(limit / 2))

          const { data: otherProducts } = await supabase
            .from("products")
            .select(`
              id,
              name,
              price,
              compare_at_price,
              images,
              stock_quantity,
              is_featured,
              categories (
                name,
                slug
              )
            `)
            .eq("is_active", true)
            .neq("categories.slug", category)
            .limit(Math.floor(limit / 2))

          const combinedData = [...(categoryProducts || []), ...(otherProducts || [])]
          setProducts(formatProducts(combinedData.slice(0, limit)))
        } else {
          // Get featured or random products
          const { data } = await query.eq("is_featured", true)
          if (data) {
            setProducts(formatProducts(data))
          }
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentProductId, category, limit])

  const formatProducts = (data: any[]): Product[] => {
    return data.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number.parseFloat(product.price),
      originalPrice: product.compare_at_price ? Number.parseFloat(product.compare_at_price) : undefined,
      image: product.images?.[0] || "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(product.name),
      category: product.categories?.name || "General",
      badge: product.compare_at_price ? "Sale" : product.is_featured ? "Featured" : "New",
      inStock: product.stock_quantity > 0,
    }))
  }

  const handleAddToCart = (product: Product) => {
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

  const handleWishlistToggle = (product: Product) => {
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="w-full h-48 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const { average: rating, count: reviewCount } = getProductRating(product.id)

            return (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </Link>
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                      {product.badge}
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isInWishlist(product.id) ? "text-red-500" : ""
                    }`}
                    onClick={() => handleWishlistToggle(product)}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-sm hover:text-primary transition-colors cursor-pointer line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <DualCurrencyDisplay usdAmount={product.price} size="sm" variant="primary" compact={true} />
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

                  <Button
                    size="sm"
                    className="w-full h-8 text-xs"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
