import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Perfumes",
    image: "/placeholder.svg?height=200&width=200&text=Perfumes",
    count: 150,
    slug: "perfumes",
  },
  {
    id: 2,
    name: "Wigs",
    image: "/placeholder.svg?height=200&width=200&text=Wigs",
    count: 300,
    slug: "wigs",
  },
  {
    id: 3,
    name: "Cars",
    image: "/placeholder.svg?height=200&width=200&text=Cars",
    count: 200,
    slug: "cars",
  },
  {
    id: 4,
    name: "Wines",
    image: "/placeholder.svg?height=200&width=200&text=Wines",
    count: 120,
    slug: "wines",
  },
  {
    id: 5,
    name: "Body Creams",
    image: "/placeholder.svg?height=200&width=200&text=Body+Creams",
    count: 80,
    slug: "body-creams",
  },
]

export function Categories() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
