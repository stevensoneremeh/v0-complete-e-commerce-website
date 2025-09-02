"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock wishlist data with additional product info
// const mockWishlistProducts = [
//   {
//     id: 1,
//     name: "Wireless Headphones Pro",
//     price: 99.99,
//     originalPrice: 129.99,
//     rating: 4.5,
//     reviews: 128,
//     image: "/placeholder.svg?height=300&width=300",
//     inStock: true,
//   },
//   {
//     id: 2,
//     name: "Smart Fitness Watch",
//     price: 199.99,
//     originalPrice: 249.99,
//     rating: 4.8,
//     reviews: 89,
//     image: "/placeholder.svg?height=300&width=300",
//     inStock: true,
//   },
//   {
//     id: 3,
//     name: "Premium Laptop Backpack",
//     price: 49.99,
//     originalPrice: 69.99,
//     rating: 4.3,
//     reviews: 156,
//     image: "/placeholder.svg?height=300&width=300",
//     inStock: false,
//   },
// ]

export default function WishlistPage() {
  const { items, removeItem, count } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  // Remove the mock data and use actual wishlist items
  const wishlistProducts = items.map((item) => ({
    ...item,
    originalPrice: item.price + 20, // Mock original price
    rating: 4.5,
    reviews: 100,
    inStock: true,
    badge: "Wishlist",
  }))

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

  const handleRemoveFromWishlist = (productId: number, productName: string) => {
    removeItem(productId)
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    })
  }

  // Update the empty state check
  if (count === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Your wishlist is empty</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Save items you love to your wishlist and never lose track of them again.
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          {/* Update the header text */}
          <p className="text-muted-foreground">
            {count} item{count !== 1 ? "s" : ""} saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold mb-2 hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" disabled={!product.inStock} onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center space-y-4">
          <h2 className="text-xl font-semibold">Want to add more items?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/categories">Shop by Category</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
