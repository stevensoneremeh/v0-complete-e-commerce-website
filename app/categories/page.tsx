import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest gadgets, smartphones, laptops, and tech accessories",
    image: "/placeholder.svg?height=300&width=400",
    count: 150,
    subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras"],
  },
  {
    id: 2,
    name: "Fashion",
    description: "Trendy clothing, shoes, and accessories for all occasions",
    image: "/placeholder.svg?height=300&width=400",
    count: 300,
    subcategories: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"],
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Everything for your home, garden, and outdoor spaces",
    image: "/placeholder.svg?height=300&width=400",
    count: 200,
    subcategories: ["Furniture", "Decor", "Kitchen", "Garden Tools"],
  },
  {
    id: 4,
    name: "Sports & Fitness",
    description: "Sports equipment, fitness gear, and outdoor activities",
    image: "/placeholder.svg?height=300&width=400",
    count: 120,
    subcategories: ["Fitness Equipment", "Sports Gear", "Outdoor", "Activewear"],
  },
  {
    id: 5,
    name: "Books & Media",
    description: "Books, e-books, audiobooks, and educational materials",
    image: "/placeholder.svg?height=300&width=400",
    count: 80,
    subcategories: ["Fiction", "Non-Fiction", "Educational", "Children's Books"],
  },
  {
    id: 6,
    name: "Beauty & Health",
    description: "Skincare, makeup, health supplements, and wellness products",
    image: "/placeholder.svg?height=300&width=400",
    count: 90,
    subcategories: ["Skincare", "Makeup", "Health", "Personal Care"],
  },
  {
    id: 7,
    name: "Toys & Games",
    description: "Fun toys, board games, and entertainment for all ages",
    image: "/placeholder.svg?height=300&width=400",
    count: 75,
    subcategories: ["Action Figures", "Board Games", "Educational Toys", "Puzzles"],
  },
  {
    id: 8,
    name: "Automotive",
    description: "Car accessories, tools, and automotive maintenance products",
    image: "/placeholder.svg?height=300&width=400",
    count: 65,
    subcategories: ["Car Accessories", "Tools", "Maintenance", "Electronics"],
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for. From electronics to fashion,
            we have everything you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4" variant="secondary">
                      {category.count} items
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => (
                        <Badge key={sub} variant="outline" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
