"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useReviews } from "@/components/reviews-provider"
import { useToast } from "@/hooks/use-toast"
import { ReviewForm } from "@/components/review-form"
import { ReviewsList } from "@/components/reviews-list"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number | null
  images: string[]
  badge: string
  inStock: boolean
  category: string
  brand: string
  description: string
  shortDescription: string
  features: string[]
  specifications: Record<string, string>
  sku: string
  stockQuantity: number
  metaTitle?: string
  metaDescription?: string
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getProductRating } = useReviews()
  const { toast } = useToast()

  const { average: rating, count: reviewCount } = getProductRating(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })
    }
    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name} added to your cart.`,
    })
  }

  const handleWishlistToggle = () => {
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
        image: product.images[0],
      })
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <main className="responsive-container py-8 sm:py-12 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 overflow-x-auto pb-2">
        <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
          Home
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <Link href="/products" className="hover:text-primary transition-colors whitespace-nowrap">
          Products
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors whitespace-nowrap">
          {product.category}
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground whitespace-nowrap truncate">{product.name}</span>
      </div>

      {/* Back Button */}
      <Button variant="ghost" className="mb-6 sm:mb-8 h-9 px-3 text-sm" asChild>
        <Link href="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted/20">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-xl border-2 transition-all hover:border-primary/50 ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
              <Badge className="text-xs sm:text-sm font-semibold">{product.badge}</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">{product.brand}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-balance">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4 sm:mb-6 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${i < Math.floor(rating) ? "text-accent fill-accent" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {rating > 0 ? `${rating.toFixed(1)} (${reviewCount} reviews)` : "No reviews yet"}
              </span>
            </div>

            <div className="mb-6 sm:mb-8 space-y-2">
              <DualCurrencyDisplay usdAmount={product.price} size="lg" variant="primary" />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-2 flex-wrap">
                  <DualCurrencyDisplay
                    usdAmount={product.originalPrice}
                    size="lg"
                    variant="muted"
                    className="line-through text-sm"
                  />
                  <Badge variant="destructive" className="text-xs sm:text-sm">Save ${(product.originalPrice - product.price).toFixed(2)}</Badge>
                </div>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{product.description}</p>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm sm:text-base">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !product.inStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-sm">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <Button size="lg" className="luxury-button flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="text-sm sm:text-base">{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlistToggle}
                className={`luxury-button-outline ${isInWishlist(product.id) ? "text-accent border-accent/30" : ""}`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-accent" : ""}`} />
              </Button>
            </div>

            <WhatsAppButton
              product={{
                name: product.name,
                price: product.price,
                category: product.category,
              }}
              className="w-full"
              size="lg"
            />
          </div>

          {/* Stock Status */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm sm:text-base border ${
              product.inStock ? "bg-accent/5 border-accent/20 text-accent" : "bg-destructive/5 border-destructive/20 text-destructive"
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className={`font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}>
              {product.inStock ? `In Stock (${product.stockQuantity} available)` : "Currently Out of Stock"}
            </span>
          </div>

          {/* Product Meta */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <Link href={`/categories/${product.category.toLowerCase()}`} className="text-primary hover:underline">
                {product.category}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brand:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU:</span>
              <span className="font-mono text-xs">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
                {product.features.length > 0 && (
                  <>
                    <h4 className="font-semibold mb-3">Key Features:</h4>
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                {Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-muted">
                        <span className="font-medium text-muted-foreground">{key}:</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available for this product.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-8">
              <ReviewForm productId={product.id} productName={product.name} />
              <ReviewsList productId={product.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
