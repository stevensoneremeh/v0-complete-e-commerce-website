import { type NextRequest, NextResponse } from "next/server"
import { createPublicSupabaseClient, verifyAdmin } from "@/lib/supabase-server-secure"

export async function GET(request: NextRequest) {
  try {
    // Use public client for GET requests to enforce RLS
    const supabase = await createPublicSupabaseClient()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")

    let query = supabase
      .from("products")
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq("is_active", true)

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

    const { data: products, error } = await query

    if (error) {
      console.error("Error fetching products:", error)
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
    // Verify admin access for POST operations
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const productData = await request.json()

    const { data: product, error } = await supabase.from("products").insert([productData]).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
