import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ablnatasha.vercel.app"

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/products",
    "/properties",
    "/categories",
    "/auth",
    "/cart",
    "/wishlist",
    "/orders",
    "/profile",
  ]

  // Category pages
  const categories = ["perfumes", "wigs", "cars", "wines", "body-creams"]

  // Generate sitemap entries
  const staticEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page === "" ? 1 : 0.8,
  }))

  const categoryEntries = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...categoryEntries]
}
