import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ablnatasha.vercel.app"

  // Static pages with proper priorities
  const staticPages = [
    { url: "", priority: 1.0, changeFrequency: "daily" as const },
    { url: "/products", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/properties", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/categories", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/auth", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/cart", priority: 0.3, changeFrequency: "never" as const },
    { url: "/wishlist", priority: 0.3, changeFrequency: "never" as const },
  ]

  // Category pages
  const categories = [
    { slug: "perfumes", priority: 0.8 },
    { slug: "wigs", priority: 0.8 },
    { slug: "cars", priority: 0.8 },
    { slug: "wines", priority: 0.8 },
    { slug: "body-creams", priority: 0.8 },
    { slug: "jewelry", priority: 0.8 },
  ]

  // Property categories
  const propertyCategories = [
    { slug: "penthouse", priority: 0.7 },
    { slug: "villa", priority: 0.7 },
    { slug: "apartment", priority: 0.7 },
    { slug: "beachfront", priority: 0.7 },
  ]

  // Generate sitemap entries
  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: category.priority,
  }))

  const propertyEntries = propertyCategories.map((category) => ({
    url: `${baseUrl}/properties?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: category.priority,
  }))

  return [...staticEntries, ...categoryEntries, ...propertyEntries]
}
