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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: product, error: dbError } = await supabase
      .from("products")
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .eq("id", id)
      .single()

    if (dbError) {
      console.error("Error fetching product:", dbError)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const updates = normalizeProductPayload(await request.json())

    const { data: product, error: dbError } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        categories (
          name,
          slug
        )
      `)
      .single()

    if (dbError) {
      console.error("Error updating product:", dbError)
      return NextResponse.json({ error: "Failed to update product", details: dbError.message }, { status: 500 })
    }

    // Revalidate all product-related paths
    revalidatePath("/products")
    revalidatePath("/")
    revalidatePath(`/products/${id}`)
    revalidateTag("products")

    return NextResponse.json({ product })
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid price") {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const updates = normalizeProductPayload(await request.json())

    const { data: product, error: dbError } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (dbError) {
      console.error("Error updating product:", dbError)
      return NextResponse.json({ error: "Failed to update product", details: dbError.message }, { status: 500 })
    }

    // Revalidate all product-related paths
    revalidatePath("/products")
    revalidatePath("/")
    revalidatePath(`/products/${id}`)
    revalidateTag("products")

    return NextResponse.json({ product })
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid price") {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 })
    }
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { error: dbError } = await supabase.from("products").delete().eq("id", id)

    if (dbError) {
      console.error("Error deleting product:", dbError)
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    }

    // Revalidate all product-related paths
    revalidatePath("/products")
    revalidatePath("/")
    revalidateTag("products")

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
