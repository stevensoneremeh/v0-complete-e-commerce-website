import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category_id, stock_quantity, is_featured, is_active, images } = body

    if (!name || !category_id || price <= 0) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-")

    const { data: product, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          slug,
          description: description || "",
          price: parseFloat(price),
          category_id,
          stock_quantity: parseInt(stock_quantity) || 0,
          is_featured: is_featured || false,
          is_active: is_active !== false,
          status: "active",
          images: images || [],
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[TEST] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error("[TEST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
