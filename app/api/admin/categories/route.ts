import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"
import { revalidatePath, revalidateTag } from "next/cache"

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

    return NextResponse.json({ categories: categoriesWithCount })
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

    // Revalidate all category-related paths
    revalidatePath("/products")
    revalidatePath("/categories")
    revalidatePath("/")
    revalidateTag("categories")
    revalidateTag("products")

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("Error in categories POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
