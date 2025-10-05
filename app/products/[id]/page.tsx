import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetailClient } from "@/components/product-detail-client"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch product from database - try by ID first, then by slug
  let { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  // If not found by ID, try by slug
  if (error || !product) {
    const { data: productBySlug } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq("slug", id)
      .eq("is_active", true)
      .single()
    
    product = productBySlug
  }

  if (!product) {
    notFound()
  }

  // Format product data
  const formattedProduct = {
    id: product.id,
    name: product.name,
    price: Number.parseFloat(product.price),
    originalPrice: product.compare_at_price ? Number.parseFloat(product.compare_at_price) : null,
    images: product.images || ["/placeholder.svg?height=500&width=500&text=" + encodeURIComponent(product.name)],
    badge: product.compare_at_price ? "Sale" : product.is_featured ? "Featured" : "New",
    inStock: product.stock_quantity > 0,
    category: product.categories?.name || "General",
    brand: "Premium", // Default brand
    description: product.description || "High-quality product with excellent features.",
    shortDescription: product.short_description || "",
    features: product.features || [],
    specifications: product.specifications || {},
    sku: product.sku,
    stockQuantity: product.stock_quantity,
    metaTitle: product.meta_title,
    metaDescription: product.meta_description,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetailClient product={formattedProduct} />
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("name, meta_title, meta_description, images")
    .eq("id", id)
    .single()

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    }
  }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || `Shop ${product.name} at ABL Natasha Enterprises`,
    openGraph: {
      title: product.meta_title || product.name,
      description: product.meta_description || `Shop ${product.name} at ABL Natasha Enterprises`,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}
