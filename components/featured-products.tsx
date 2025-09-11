"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useReviews } from "@/components/reviews-provider"
import { useToast } from "@/hooks/use-toast"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

const featuredProducts = [
  {
    id: "perfume-1",
    name: "Luxury French Perfume",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=300&width=300&text=Luxury+Perfume",
    badge: "Best Seller",
    inStock: true,
    category: "Perfumes",
  },
  {
    id: "wig-1",
    name: "Premium Human Hair Wig",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=300&width=300&text=Premium+Wig",
    badge: "New",
    inStock: true,
    category: "Wigs",
  },
  {
    id: "car-1",
    name: "2023 Toyota Camry",
    price: 28999.99,
    originalPrice: 32999.99,
    image: "/placeholder.svg?height=300&width=300&text=Toyota+Camry",
    badge: "Sale",
    inStock: true,
    category: "Cars",
  },
  {
    id: "wine-1",
    name: "Premium Red Wine Collection",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300&text=Premium+Wine",
    badge: "Popular",
    inStock: true,
    category: "Wines",
  },
  {
    id: "cream-1",
    name: "Luxury Body Cream Set",
    price: 59.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=300&width=300&text=Body+Cream",
    badge: "Trending",
    inStock: true,
    category: "Body Creams",
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getProductRating } = useReviews()
  const { toast } = useToast()
  const [products, setProducts] = useState(featuredProducts)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
          .eq("is_featured", true)
          .eq("is_active", true)
          .limit(5)

        if (data && !error) {
          const formattedProducts = data.map((product) => ({
            id: String(product.id),
            name: product.name,
            price: Number.parseFloat(product.price),
            originalPrice: product.compare_at_price ? Number.parseFloat(product.compare_at_price) : 0,
            image:
              product.images?.[0] || "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(product.name),
            badge: product.compare_at_price ? "Sale" : "Featured",
            inStock: product.stock_quantity > 0,
            category: product.categories?.name || "General",
          }))
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        // Keep default products as fallback
      }
    }

    fetchProducts()
  }, [])

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

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-balance">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl mx-auto text-pretty px-2">
            Discover our handpicked selection of premium perfumes, luxury wigs, quality cars, fine wines, and body care
            products
          </p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {products.map((product) => {
            const { average: rating, count: reviewCount } = getProductRating(product.id)

            return (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <CardContent className="p-0 flex-1">
                  <div className="relative overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-32 xs:h-40 sm:h-48 md:h-52 lg:h-56 xl:h-60 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </Link>
                    <Badge
                      className="absolute top-1 xs:top-1.5 sm:top-2 left-1 xs:left-1.5 sm:left-2 text-[10px] xs:text-xs px-1 xs:px-2 py-0.5"
                      variant="secondary"
                    >
                      {product.badge}
                    </Badge>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`absolute top-1 xs:top-1.5 sm:top-2 right-1 xs:right-1.5 sm:right-2 h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isInWishlist(product.id) ? "text-red-500" : ""
                      }`}
                      onClick={() => handleWishlistToggle(product)}
                    >
                      <Heart
                        className={`h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`}
                      />
                    </Button>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center px-1 xs:px-2">
                          <Badge variant="destructive" className="mb-1 text-[10px] xs:text-xs">
                            Out of Stock
                          </Badge>
                          <p className="text-white text-[10px] xs:text-xs">Still available for wishlist</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 xs:p-3 sm:p-4 flex-1 flex flex-col">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-xs xs:text-sm sm:text-base mb-1 xs:mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2 flex-shrink-0">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mb-1 xs:mb-2 flex-shrink-0">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 ${
                              i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground ml-1 xs:ml-1 sm:ml-2">
                        {reviewCount > 0 ? `(${reviewCount})` : "(0)"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2 xs:mb-3 sm:mb-4 flex-shrink-0">
                      <div className="flex flex-col space-y-0.5 xs:space-y-1">
                        <DualCurrencyDisplay usdAmount={product.price} size="xs" variant="primary" compact={true} />
                        {product.originalPrice && product.originalPrice > product.price && (
                          <DualCurrencyDisplay
                            usdAmount={product.originalPrice}
                            size="xs"
                            variant="muted"
                            compact={true}
                            className="line-through"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-2 xs:p-3 sm:p-4 pt-0 space-y-1.5 xs:space-y-2 mt-auto">
                  <Button
                    className="w-full h-8 xs:h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm px-2 xs:px-3"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1 xs:mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="hidden xs:inline truncate">
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </span>
                    <span className="xs:hidden truncate">{product.inStock ? "Add" : "Out"}</span>
                  </Button>
                  <WhatsAppButton
                    product={{
                      name: product.name,
                      price: product.price,
                      category: product.category,
                    }}
                    className="w-full h-8 xs:h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm px-2 xs:px-3"
                    variant="outline"
                  />
                </CardFooter>
              </Card>
            )
          })}
        </div>
        <div className="text-center mt-6 sm:mt-8 md:mt-10 lg:mt-12">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-9 xs:h-10 sm:h-11 px-4 xs:px-6 sm:px-8 text-xs xs:text-sm sm:text-base bg-transparent"
          >
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
