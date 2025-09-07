import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Category data mapping
const categoryData = {
  "1": { name: "Perfumes", slug: "perfumes" },
  "2": { name: "Wigs", slug: "wigs" },
  "3": { name: "Cars", slug: "cars" },
  "4": { name: "Wines", slug: "wines" },
  "5": { name: "Body Creams", slug: "body-creams" },
  perfumes: { name: "Perfumes", slug: "perfumes" },
  wigs: { name: "Wigs", slug: "wigs" },
  cars: { name: "Cars", slug: "cars" },
  wines: { name: "Wines", slug: "wines" },
  "body-creams": { name: "Body Creams", slug: "body-creams" },
}

// Sample products for each category
const categoryProducts = {
  perfumes: [
    {
      id: 1,
      name: "Luxury Designer Perfume",
      price: 149.99,
      originalPrice: 199.99,
      image: "/placeholder.svg?height=300&width=300&text=Designer+Perfume",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Floral Essence Perfume",
      price: 89.99,
      originalPrice: 120.0,
      image: "/placeholder.svg?height=300&width=300&text=Floral+Perfume",
      rating: 4.6,
      reviews: 89,
      badge: "New",
    },
    {
      id: 3,
      name: "Oriental Spice Fragrance",
      price: 179.99,
      image: "/placeholder.svg?height=300&width=300&text=Oriental+Perfume",
      rating: 4.9,
      reviews: 156,
      badge: "Premium",
    },
  ],
  wigs: [
    {
      id: 4,
      name: "Premium Lace Front Wig",
      price: 299.99,
      originalPrice: 399.99,
      image: "/placeholder.svg?height=300&width=300&text=Lace+Front+Wig",
      rating: 4.7,
      reviews: 98,
      badge: "Best Seller",
    },
    {
      id: 5,
      name: "Curly Human Hair Wig",
      price: 249.99,
      originalPrice: 320.0,
      image: "/placeholder.svg?height=300&width=300&text=Curly+Wig",
      rating: 4.5,
      reviews: 67,
      badge: "Popular",
    },
    {
      id: 6,
      name: "Straight Synthetic Wig",
      price: 129.99,
      originalPrice: 180.0,
      image: "/placeholder.svg?height=300&width=300&text=Straight+Wig",
      rating: 4.3,
      reviews: 45,
    },
  ],
  cars: [
    {
      id: 7,
      name: "2024 BMW X5 SUV",
      price: 65999.99,
      image: "/placeholder.svg?height=300&width=300&text=BMW+X5",
      rating: 4.9,
      reviews: 23,
      badge: "Premium",
    },
    {
      id: 8,
      name: "Mercedes-Benz C-Class",
      price: 45999.99,
      originalPrice: 52000.0,
      image: "/placeholder.svg?height=300&width=300&text=Mercedes+C-Class",
      rating: 4.8,
      reviews: 18,
      badge: "Luxury",
    },
    {
      id: 9,
      name: "Audi A4 Sedan",
      price: 42999.99,
      image: "/placeholder.svg?height=300&width=300&text=Audi+A4",
      rating: 4.7,
      reviews: 31,
    },
  ],
  wines: [
    {
      id: 10,
      name: "Premium Red Wine Collection",
      price: 89.99,
      originalPrice: 120.0,
      image: "/placeholder.svg?height=300&width=300&text=Premium+Red+Wine",
      rating: 4.8,
      reviews: 76,
      badge: "Best Seller",
    },
    {
      id: 11,
      name: "Champagne Luxury Edition",
      price: 199.99,
      originalPrice: 250.0,
      image: "/placeholder.svg?height=300&width=300&text=Luxury+Champagne",
      rating: 4.9,
      reviews: 54,
      badge: "Premium",
    },
    {
      id: 12,
      name: "White Wine Vintage",
      price: 65.99,
      originalPrice: 85.0,
      image: "/placeholder.svg?height=300&width=300&text=White+Wine",
      rating: 4.6,
      reviews: 42,
    },
  ],
  "body-creams": [
    {
      id: 13,
      name: "Luxury Anti-Aging Body Cream",
      price: 79.99,
      originalPrice: 99.99,
      image: "/placeholder.svg?height=300&width=300&text=Anti-Aging+Cream",
      rating: 4.7,
      reviews: 134,
      badge: "Best Seller",
    },
    {
      id: 14,
      name: "Organic Moisturizing Body Butter",
      price: 45.99,
      originalPrice: 59.99,
      image: "/placeholder.svg?height=300&width=300&text=Organic+Body+Butter",
      rating: 4.5,
      reviews: 89,
      badge: "Organic",
    },
    {
      id: 15,
      name: "Vitamin E Body Lotion",
      price: 29.99,
      originalPrice: 39.99,
      image: "/placeholder.svg?height=300&width=300&text=Vitamin+E+Lotion",
      rating: 4.4,
      reviews: 67,
    },
  ],
}

interface CategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params
  const category = categoryData[id as keyof typeof categoryData]

  if (!category) {
    notFound()
  }

  const products = categoryProducts[category.slug as keyof typeof categoryProducts] || []

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our premium collection of {category.name.toLowerCase()}. Quality products curated for your
            lifestyle.
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Showing {products.length} products</span>
          </div>
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border rounded-md bg-background">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Customer Rating</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3" variant="secondary">
                        {product.badge}
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
