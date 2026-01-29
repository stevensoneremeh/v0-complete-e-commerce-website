import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"
import { revalidatePath, revalidateTag } from "next/cache"

const normalizeProductPayload = (input: Record<string, unknown>) => {
  const data: Record<string, unknown> = { ...input }

  if ("price" in data) {
    const price = Number(data.price)
    if (!Number.isFinite(price)) {
      throw new Error("Invalid price")
    }
    data.price = price
  }

  if ("stock_quantity" in data) {
    const stock = Number.parseInt(String(data.stock_quantity))
    data.stock_quantity = Number.isFinite(stock) ? stock : 0
  }

  if ("is_featured" in data) {
    data.is_featured = data.is_featured === true
  }

  if ("is_active" in data) {
    data.is_active = data.is_active === true
  }

  if ("images" in data) {
    data.images = Array.isArray(data.images) ? data.images.filter(Boolean) : []
  }

  if ("category_id" in data) {
    const category = data.category_id
    if (category === undefined) {
      delete data.category_id
    } else if (category === null) {
      // Allow explicit clearing
      data.category_id = null
    } else if (typeof category === "string") {
      const trimmed = category.trim()
      if (!trimmed || trimmed === "all" || trimmed === "none") {
        data.category_id = null
      }
    }
  }

  if ("slug" in data && typeof data.slug === "string" && !data.slug.trim()) {
    delete data.slug
  }

  if ("sku" in data && typeof data.sku === "string" && !data.sku.trim()) {
    delete data.sku
  }

  delete data.categories

  return data
}

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")
    const status = searchParams.get("status")

    let query = supabase.from("products").select(`
        *,
        categories (
          name,
          slug
        )
      `)

    if (status) {
      query = query.eq("status", status)
    }

    if (category) {
      query = query.eq("categories.slug", category)
    }

    if (featured === "true") {
      query = query.eq("is_featured", true)
    }

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    query = query.order("created_at", { ascending: false })

    const { data: products, error: dbError } = await query

    if (dbError) {
      console.error("Error fetching products:", dbError)
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const productData = await request.json()

    if (!productData?.name || !productData?.description || !productData?.price || !productData?.category_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalized = normalizeProductPayload(productData)

    if (!normalized.slug) {
      normalized.slug = String(normalized.name)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    if (!normalized.sku) {
      normalized.sku = `PRD-${Date.now()}`
    }

    const { data: product, error: dbError } = await supabase.from("products").insert([normalized]).select().single()

    if (dbError) {
      console.error("Error creating product:", dbError)
      return NextResponse.json({ error: "Failed to create product", details: dbError.message }, { status: 500 })
    }

    // Revalidate all product-related paths
    revalidatePath("/products")
    revalidatePath("/")
    revalidateTag("products")

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid price") {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
