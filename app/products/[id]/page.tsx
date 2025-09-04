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
    name: "Wireless Headphones Pro",
    price: 99.99,
    originalPrice: 129.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Headphones+Main",
      "/placeholder.svg?height=500&width=500&text=Headphones+Side",
      "/placeholder.svg?height=500&width=500&text=Headphones+Case",
      "/placeholder.svg?height=500&width=500&text=Headphones+Details",
    ],
    badge: "Best Seller",
    inStock: false,
    category: "Electronics",
    brand: "Sony",
    description:
      "Experience premium sound quality with our Wireless Headphones Pro. Featuring advanced noise cancellation, 30-hour battery life, and premium comfort for all-day listening. Perfect for music lovers, professionals, and anyone who demands the best audio experience.",
    features: [
      "Active Noise Cancellation with 3 levels",
      "30-hour battery life with quick charge",
      "Premium comfort design with memory foam",
      "High-quality 40mm audio drivers",
      "Bluetooth 5.0 connectivity with multipoint",
      "Quick charge: 10 min = 5 hours playback",
      "Touch controls and voice assistant support",
      "Foldable design for easy portability",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 ohms",
      "Battery Life": "30 hours (ANC on), 40 hours (ANC off)",
      "Charging Time": "2 hours (full), 10 min (quick charge)",
      Weight: "250g",
      Connectivity: "Bluetooth 5.0, 3.5mm jack",
      Microphone: "Built-in with noise reduction",
    },
  },
  2: {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Watch+Face",
      "/placeholder.svg?height=500&width=500&text=Watch+Side",
      "/placeholder.svg?height=500&width=500&text=Watch+Apps",
      "/placeholder.svg?height=500&width=500&text=Watch+Bands",
    ],
    badge: "New",
    inStock: true,
    category: "Electronics",
    brand: "Apple",
    description:
      "Stay connected and track your fitness goals with our advanced Smart Fitness Watch. Features comprehensive health monitoring, GPS tracking, and seamless smartphone integration for the modern lifestyle.",
    features: [
      "Advanced health monitoring (heart rate, SpO2, sleep)",
      "Built-in GPS for accurate tracking",
      "5ATM water resistance",
      "7-day battery life",
      "Always-on display",
      "100+ workout modes",
      "Smart notifications and calls",
      "Music storage and playback",
    ],
    specifications: {
      Display: "1.4-inch AMOLED",
      Resolution: "454 x 454 pixels",
      "Battery Life": "7 days typical use",
      "Water Resistance": "5ATM (50 meters)",
      Connectivity: "Bluetooth 5.0, Wi-Fi, GPS",
      Sensors: "Heart rate, SpO2, accelerometer, gyroscope",
      Compatibility: "iOS 12+, Android 6.0+",
      Weight: "45g (without strap)",
    },
  },
  3: {
    id: 3,
    name: "Premium Laptop Backpack",
    price: 49.99,
    originalPrice: 69.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Backpack+Front",
      "/placeholder.svg?height=500&width=500&text=Backpack+Open",
      "/placeholder.svg?height=500&width=500&text=Backpack+Laptop",
      "/placeholder.svg?height=500&width=500&text=Backpack+Details",
    ],
    badge: "Sale",
    inStock: true,
    category: "Fashion",
    brand: "Nike",
    description:
      "Professional laptop backpack designed for modern professionals and students. Features multiple compartments, laptop protection, and ergonomic design for all-day comfort.",
    features: [
      "Fits laptops up to 17 inches",
      "Multiple organized compartments",
      "Water-resistant exterior",
      "Padded shoulder straps",
      "USB charging port",
      "Anti-theft back pocket",
      "Luggage strap for travel",
      "Lifetime warranty",
    ],
    specifications: {
      Capacity: "35 liters",
      "Laptop Compartment": "Up to 17 inches",
      Material: "Water-resistant nylon",
      Dimensions: "18 x 12 x 8 inches",
      Weight: "2.2 lbs",
      Pockets: "15+ compartments",
      Warranty: "Lifetime",
      "Color Options": "Black, Gray, Navy",
    },
  },
  4: {
    id: 4,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Speaker+Front",
      "/placeholder.svg?height=500&width=500&text=Speaker+Side",
      "/placeholder.svg?height=500&width=500&text=Speaker+Ports",
      "/placeholder.svg?height=500&width=500&text=Speaker+Size",
    ],
    badge: "Popular",
    inStock: false,
    category: "Electronics",
    brand: "Sony",
    description:
      "Powerful portable Bluetooth speaker with 360-degree sound, waterproof design, and long-lasting battery. Perfect for outdoor adventures, parties, and everyday listening.",
    features: [
      "360-degree surround sound",
      "IPX7 waterproof rating",
      "24-hour battery life",
      "Wireless stereo pairing",
      "Built-in power bank",
      "Voice assistant support",
      "Rugged outdoor design",
      "Quick charge technology",
    ],
    specifications: {
      "Power Output": "20W RMS",
      "Battery Life": "24 hours",
      "Charging Time": "4 hours",
      "Water Rating": "IPX7",
      Connectivity: "Bluetooth 5.0, AUX",
      Range: "100 feet",
      Weight: "1.8 lbs",
      Dimensions: "8 x 3 x 3 inches",
    },
  },
  5: {
    id: 5,
    name: "Running Shoes",
    price: 89.99,
    originalPrice: 119.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Shoes+Side",
      "/placeholder.svg?height=500&width=500&text=Shoes+Top",
      "/placeholder.svg?height=500&width=500&text=Shoes+Sole",
      "/placeholder.svg?height=500&width=500&text=Shoes+Details",
    ],
    badge: "Sale",
    inStock: true,
    category: "Sports",
    brand: "Nike",
    description:
      "High-performance running shoes engineered for comfort, durability, and speed. Features advanced cushioning technology and breathable materials for optimal performance.",
    features: [
      "Advanced cushioning system",
      "Breathable mesh upper",
      "Lightweight design",
      "Durable rubber outsole",
      "Reflective details for visibility",
      "Arch support technology",
      "Moisture-wicking lining",
      "Available in multiple colors",
    ],
    specifications: {
      Weight: "8.5 oz (men's size 9)",
      Drop: "10mm heel-toe",
      "Upper Material": "Engineered mesh",
      Midsole: "EVA foam with air cushioning",
      Outsole: "Durable rubber with flex grooves",
      Sizes: "US 6-14 (men's), 5-12 (women's)",
      Width: "Standard and wide available",
      Care: "Machine washable",
    },
  },
  6: {
    id: 6,
    name: "Coffee Maker Deluxe",
    price: 149.99,
    originalPrice: 179.99,
    images: [
      "/placeholder.svg?height=500&width=500&text=Coffee+Maker+Front",
      "/placeholder.svg?height=500&width=500&text=Coffee+Maker+Side",
      "/placeholder.svg?height=500&width=500&text=Coffee+Maker+Controls",
      "/placeholder.svg?height=500&width=500&text=Coffee+Maker+Interior",
    ],
    badge: "Featured",
    inStock: true,
    category: "Home",
    brand: "Samsung",
    description:
      "Professional-grade coffee maker with programmable features, multiple brew strengths, and thermal carafe. Perfect for coffee enthusiasts who demand barista-quality results at home.",
    features: [
      "Programmable 24-hour timer",
      "Multiple brew strength settings",
      "Thermal carafe keeps coffee hot",
      "Auto shut-off safety feature",
      "Water filtration system",
      "Pause and serve function",
      "Easy-clean design",
      "12-cup capacity",
    ],
    specifications: {
      Capacity: "12 cups (60 oz)",
      "Carafe Type": "Thermal stainless steel",
      Programmable: "24-hour advance brew",
      "Brew Strength": "Regular, Bold, Extra Bold",
      "Water Filter": "Charcoal filter included",
      "Auto Shut-off": "2 hours",
      Dimensions: "14 x 10 x 16 inches",
      Warranty: "2 years",
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
