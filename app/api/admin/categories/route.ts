import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET() {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: categories, error: dbError } = await supabase
      .from("categories")
      .select(`
        *,
        products(count)
      `)
      .order("sort_order", { ascending: true })

    if (dbError) {
      console.error("Error fetching categories:", dbError)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    const categoriesWithCount = categories.map(category => ({
      ...category,
      product_count: category.products?.[0]?.count || 0
    }))

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error("Error in categories API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const categoryData = await request.json()

    const { data: category, error: dbError } = await supabase
      .from("categories")
      .insert([categoryData])
      .select()
      .single()

    if (dbError) {
      console.error("Error creating category:", dbError)
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error in categories POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
