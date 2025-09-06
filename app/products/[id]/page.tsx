"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
import { CurrencySelector } from "@/components/currency-selector"

// Dynamic product data based on ID
const productDatabase = {
  1: {
    id: 1,
    name: "Luxury Designer Perfume",
    price: 149.99,
    originalPrice: 199.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Designer+Perfume",
      "/placeholder.svg?height=500&width=500&text=Perfume+Bottle",
      "/placeholder.svg?height=500&width=500&text=Perfume+Box",
      "/placeholder.svg?height=500&width=500&text=Perfume+Details",
    ],
    badge: "Best Seller",
    inStock: true,
    category: "Perfumes",
    brand: "Chanel",
    description:
      "Experience luxury with our premium designer perfume. Featuring exquisite notes of jasmine, vanilla, and sandalwood, this fragrance embodies elegance and sophistication. Perfect for special occasions or everyday luxury.",
    features: [
      "Long-lasting fragrance up to 12 hours",
      "Premium ingredients sourced globally",
      "Elegant crystal bottle design",
      "Gift box included with purchase",
      "Cruelty-free and ethically sourced",
      "Available in multiple sizes",
      "Signature scent blend",
      "Perfect for gifting",
    ],
    specifications: {
      Volume: "100ml",
      "Fragrance Family": "Floral Oriental",
      "Top Notes": "Jasmine, Bergamot",
      "Heart Notes": "Rose, Vanilla",
      "Base Notes": "Sandalwood, Musk",
      Concentration: "Eau de Parfum",
      Origin: "France",
      "Shelf Life": "3 years",
    },
  },
  2: {
    id: 2,
    name: "Premium Lace Front Wig",
    price: 299.99,
    originalPrice: 399.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Lace+Front+Wig",
      "/placeholder.svg?height=500&width=500&text=Wig+Side+View",
      "/placeholder.svg?height=500&width=500&text=Wig+Back+View",
      "/placeholder.svg?height=500&width=500&text=Wig+Details",
    ],
    badge: "New",
    inStock: true,
    category: "Wigs",
    brand: "LuxeHair",
    description:
      "Transform your look with our premium lace front wig made from 100% human hair. Features a natural hairline, breathable cap construction, and heat-resistant styling for versatile looks.",
    features: [
      "100% virgin human hair",
      "HD lace front for natural hairline",
      "Breathable cap construction",
      "Heat resistant up to 180°C",
      "Pre-plucked hairline",
      "Adjustable straps for secure fit",
      "Can be styled, colored, and cut",
      "Long-lasting with proper care",
    ],
    specifications: {
      "Hair Type": "100% Virgin Human Hair",
      Length: "16 inches",
      Color: "Natural Black (#1B)",
      "Cap Size": "Medium (22.5 inches)",
      "Lace Type": "HD Swiss Lace",
      "Hair Density": "130%",
      "Hair Texture": "Straight",
      "Cap Construction": "Lace Front with Adjustable Straps",
    },
  },
  3: {
    id: 3,
    name: "2024 BMW X5 Luxury SUV",
    price: 65999.99,
    originalPrice: 69999.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=BMW+X5+Front",
      "/placeholder.svg?height=500&width=500&text=BMW+X5+Interior",
      "/placeholder.svg?height=500&width=500&text=BMW+X5+Side",
      "/placeholder.svg?height=500&width=500&text=BMW+X5+Engine",
    ],
    badge: "Premium",
    inStock: true,
    category: "Cars",
    brand: "BMW",
    description:
      "Experience luxury and performance with the 2024 BMW X5. This premium SUV combines cutting-edge technology, superior comfort, and exceptional driving dynamics for the ultimate luxury experience.",
    features: [
      "xDrive all-wheel drive system",
      "Premium leather interior",
      "Advanced navigation system",
      "360-degree camera system",
      "Heated and ventilated seats",
      "Panoramic sunroof",
      "Harman Kardon sound system",
      "Advanced safety features",
    ],
    specifications: {
      Engine: "3.0L TwinPower Turbo I6",
      Horsepower: "335 HP",
      Transmission: "8-Speed Automatic",
      "Fuel Type": "Premium Gasoline",
      Year: "2024",
      Mileage: "Brand New",
      Drivetrain: "All-Wheel Drive",
      Seating: "5 Passengers",
    },
  },
  4: {
    id: 4,
    name: "Premium Vintage Wine Collection",
    price: 299.99,
    originalPrice: 399.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Wine+Collection",
      "/placeholder.svg?height=500&width=500&text=Wine+Bottles",
      "/placeholder.svg?height=500&width=500&text=Wine+Labels",
      "/placeholder.svg?height=500&width=500&text=Wine+Gift+Box",
    ],
    badge: "Limited Edition",
    inStock: false,
    category: "Wines",
    brand: "Château Margaux",
    description:
      "Indulge in our premium vintage wine collection featuring carefully selected bottles from renowned vineyards. Each bottle represents years of craftsmanship and tradition.",
    features: [
      "Aged to perfection",
      "Premium vineyard selection",
      "Elegant gift packaging",
      "Certificate of authenticity",
      "Perfect for special occasions",
      "Collector's edition bottles",
      "Expert sommelier curated",
      "Temperature controlled storage",
    ],
    specifications: {
      Vintage: "2018",
      Region: "Bordeaux, France",
      "Alcohol Content": "13.5%",
      Volume: "750ml",
      "Grape Variety": "Cabernet Sauvignon Blend",
      "Serving Temperature": "16-18°C",
      Storage: "Cool, dark place",
      "Aging Potential": "15-20 years",
    },
  },
  5: {
    id: 5,
    name: "Luxury Anti-Aging Body Cream",
    price: 89.99,
    originalPrice: 119.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Body+Cream+Jar",
      "/placeholder.svg?height=500&width=500&text=Cream+Texture",
      "/placeholder.svg?height=500&width=500&text=Cream+Application",
      "/placeholder.svg?height=500&width=500&text=Cream+Packaging",
    ],
    badge: "Best Seller",
    inStock: true,
    category: "Body Creams",
    brand: "La Mer",
    description:
      "Rejuvenate your skin with our luxury anti-aging body cream. Formulated with premium ingredients to hydrate, firm, and restore your skin's natural radiance.",
    features: [
      "Advanced anti-aging formula",
      "Deep moisturizing properties",
      "Firming and toning effects",
      "Natural organic ingredients",
      "Suitable for all skin types",
      "Non-greasy formula",
      "Dermatologist tested",
      "Cruelty-free formulation",
    ],
    specifications: {
      Volume: "200ml",
      "Skin Type": "All skin types",
      "Key Ingredients": "Retinol, Hyaluronic Acid, Vitamin E",
      Application: "Morning and evening",
      Texture: "Rich cream",
      Fragrance: "Light floral scent",
      "Shelf Life": "24 months",
      Origin: "Switzerland",
    },
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD")
  const [convertedPrice, setConvertedPrice] = useState(0)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getProductRating } = useReviews()
  const { toast } = useToast()

  // Get product from database
  const product = productDatabase[productId as keyof typeof productDatabase]

  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { average: rating, count: reviewCount } = getProductRating(product.id)

  const handleCurrencyChange = (currency: "USD" | "NGN", convertedAmount: number) => {
    setSelectedCurrency(currency)
    setConvertedPrice(convertedAmount)
  }

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
    <div className="min-h-screen bg-background">
      <Header />
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
                <CurrencySelector amount={product.price} onCurrencyChange={handleCurrencyChange} />
                {product.originalPrice > product.price && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
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
                productName={product.name}
                productPrice={convertedPrice || product.price}
                productUrl={typeof window !== "undefined" ? window.location.href : ""}
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
                {product.inStock ? "In Stock - Ready to Ship" : "Currently Out of Stock"}
              </span>
            </div>

            {!product.inStock && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Don't worry!</strong> You can still add this item to your wishlist and we'll notify you when
                  it's back in stock.
                </p>
              </div>
            )}

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
                <span className="font-mono text-xs">SKU-{product.id.toString().padStart(6, "0")}</span>
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
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-muted">
                        <span className="font-medium text-muted-foreground">{key}:</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
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
      <Footer />
    </div>
  )
}
