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
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        <span>/</span>
        <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-primary">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Back Button */}
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-full object-cover cursor-zoom-in"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
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
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="mb-2">{product.badge}</Badge>
              <Badge variant="outline">{product.brand}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {rating > 0 ? `${rating} (${reviewCount} reviews)` : "No reviews yet"}
              </span>
            </div>

            <div className="mb-6">
              <DualCurrencyDisplay usdAmount={product.price} size="lg" variant="primary" />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="mt-2 flex items-center space-x-2">
                  <DualCurrencyDisplay
                    usdAmount={product.originalPrice}
                    size="lg"
                    variant="muted"
                    className="line-through"
                  />
                  <Badge variant="destructive">Save ${(product.originalPrice - product.price).toFixed(2)}</Badge>
                </div>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !product.inStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlistToggle}
                className={isInWishlist(product.id) ? "text-red-500 border-red-200" : ""}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
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
            className={`flex items-center space-x-2 p-4 rounded-lg ${
              product.inStock ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
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
