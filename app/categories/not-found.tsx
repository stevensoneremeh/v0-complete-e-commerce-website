"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Grid3X3, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

export default function CategoryNotFound() {
  const [categories, setCategories] = useState([
    { slug: "perfumes", name: "Perfumes" },
    { slug: "wigs", name: "Wigs" },
    { slug: "cars", name: "Cars" },
    { slug: "wines", name: "Wines" },
    { slug: "body-creams", name: "Body Creams" },
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("categories")
          .select("slug, name")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .limit(5)

        if (data && !error) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        // Keep fallback categories
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-8 max-w-lg">
          <div className="space-y-4">
            <div className="relative">
              <Grid3X3 className="h-24 w-24 mx-auto text-muted/20 mb-4" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Category Not Found
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-foreground">This Category Doesn't Exist</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The category you're looking for might have been removed or the URL was entered incorrectly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold"
            >
              <Link href="/categories">
                <Grid3X3 className="h-5 w-5 mr-2" />
                Browse Categories
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="border-2 bg-transparent">
              <Link href="/products">
                <ShoppingBag className="h-5 w-5 mr-2" />
                All Products
              </Link>
            </Button>
          </div>

          <div className="pt-6">
            <p className="text-muted-foreground">
              Explore our available categories:{" "}
              {categories.map((category, index) => (
                <span key={category.slug}>
                  <Link href={`/categories/${category.slug}`} className="text-primary hover:underline">
                    {category.name}
                  </Link>
                  {index < categories.length - 1 && (index === categories.length - 2 ? ", and " : ", ")}
                </span>
              ))}
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
