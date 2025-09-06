import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Perfumes",
    description: "Luxury fragrances, designer perfumes, and premium scents",
    image: "/placeholder.svg?height=300&width=400&text=Perfumes",
    count: 150,
    subcategories: ["Designer Perfumes", "Unisex Fragrances", "Body Sprays", "Gift Sets"],
  },
  {
    id: 2,
    name: "Wigs",
    description: "Premium quality wigs, hair pieces, and styling accessories",
    image: "/placeholder.svg?height=300&width=400&text=Wigs",
    count: 300,
    subcategories: ["Lace Front Wigs", "Synthetic Wigs", "Human Hair Wigs", "Hair Extensions"],
  },
  {
    id: 3,
    name: "Cars",
    description: "Premium vehicles for sales and hire, automotive accessories",
    image: "/placeholder.svg?height=300&width=400&text=Cars",
    count: 200,
    subcategories: ["Luxury Cars", "SUVs", "Car Hire", "Automotive Accessories"],
  },
  {
    id: 4,
    name: "Wines",
    description: "Premium wines, champagne, and luxury beverages",
    image: "/placeholder.svg?height=300&width=400&text=Wines",
    count: 120,
    subcategories: ["Red Wines", "White Wines", "Champagne", "Wine Accessories"],
  },
  {
    id: 5,
    name: "Body Creams",
    description: "Luxury body creams, moisturizers, and skincare products",
    image: "/placeholder.svg?height=300&width=400&text=Body+Creams",
    count: 80,
    subcategories: ["Anti-Aging Creams", "Moisturizers", "Organic Products", "Body Butters"],
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
            Explore our curated collection of luxury products across premium categories. From designer perfumes to
            luxury cars, discover the finest selection at ABL Natasha Enterprises.
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
