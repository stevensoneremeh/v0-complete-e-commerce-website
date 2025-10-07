import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

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

    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    }

    if (!productData.sku) {
      productData.sku = `PRD-${Date.now()}`
    }

    const { data: product, error: dbError } = await supabase.from("products").insert([productData]).select().single()

    if (dbError) {
      console.error("Error creating product:", dbError)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
