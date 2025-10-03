"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ShoppingBag } from "lucide-react"
import { useState, useEffect } from 'react';

export function Categories() {
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    image: string;
    href: string;
  }>>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()

          const categoryImages: Record<string, string> = {
            'perfumes': '/luxury-perfume-bottles-elegant-display.jpg',
            'wigs': '/premium-human-hair-wigs-luxury-salon-display.jpg',
            'cars': '/luxury-sports-car-showroom-premium-vehicles.jpg',
            'wines': '/premium-wine-collection-luxury-bottles-cellar.jpg',
            'body-creams': '/luxury-skincare-products-premium-cosmetics-spa.jpg',
          }

          const mappedCategories = data
            .filter((cat: any) => cat.is_active)
            .map((category: any) => ({
              id: category.id,
              name: category.name,
              image: categoryImages[category.slug] || category.image_url || '/placeholder.svg?height=300&width=300&text=Category',
              href: `/categories/${category.slug}`
            }))

          setCategories(mappedCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to default categories on error
        setCategories([
          {
            id: '1',
            name: "Perfumes",
            image: "/luxury-perfume-bottles-elegant-display.jpg",
            href: "/categories/perfumes"
          },
          {
            id: '2',
            name: "Wigs",
            image: "/premium-human-hair-wigs-luxury-salon-display.jpg",
            href: "/categories/wigs"
          },
          {
            id: '3',
            name: "Cars",
            image: "/luxury-sports-car-showroom-premium-vehicles.jpg",
            href: "/categories/cars"
          },
          {
            id: '4',
            name: "Wines",
            image: "/premium-wine-collection-luxury-bottles-cellar.jpg",
            href: "/categories/wines"
          },
          {
            id: '5',
            name: "Body Creams",
            image: "/luxury-skincare-products-premium-cosmetics-spa.jpg",
            href: "/categories/body-creams"
          },
        ])
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="section-padding luxury-gradient-subtle">
      <div className="responsive-container">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Categories</span>
          </div>
          <h2 className="display-2 mb-6 text-balance">Shop by Category</h2>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto text-pretty">
            Explore our curated collection of luxury products across diverse categories, each carefully selected for
            exceptional quality and elegance
          </p>
        </div>

        <div className="responsive-grid slide-up">
          {categories.map((category, index) => (
            <Link key={category.id} href={category.href} className="group">
              <Card
                className={`category-card h-full overflow-hidden bg-gradient-to-br ${category.gradient || 'from-gray-200 to-gray-300'} hover:shadow-2xl`}
              >
                <CardContent className="p-0 h-full">
                  <div className="relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={`${category.name} - Premium ${category.description || 'Category'}`}
                      width={300}
                      height={240}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground">
                      {category.count || 0} items
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-b from-card to-background">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="heading-3 group-hover:text-primary transition-colors">{category.name}</h3>
                      <ShoppingBag className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="body-small text-muted-foreground mb-4">{category.description || 'Explore our curated collection.'}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">Explore Collection</span>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <span className="text-sm">→</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 fade-in">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 luxury-button px-8 py-4 rounded-xl text-base font-semibold group"
          >
            View All Categories
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
