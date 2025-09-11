import { NextResponse } from "next/server"

export function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

# Sitemap
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || "https://abl-natasha.vercel.app"}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /auth/
Disallow: /profile/
Disallow: /orders/
Disallow: /bookings/

# Allow important pages
Allow: /products
Allow: /properties
Allow: /categories
Allow: /about
Allow: /contact

# Crawl delay
Crawl-delay: 1
`.trim()

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
