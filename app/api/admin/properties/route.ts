import { verifyAdmin } from "@/lib/auth/admin-guard"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError) return authError

  try {
    const { data: properties, error: dbError } = await supabase
      .from("real_estate_properties")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          images,
          price,
          status
        )
      `)
      .order("created_at", { ascending: false })

    if (dbError) throw dbError

    return NextResponse.json(properties)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError) return authError

  try {
    const propertyData = await request.json()

    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: propertyData.title,
        slug: propertyData.title.toLowerCase().replace(/\s+/g, "-"),
        description: propertyData.description,
        price: propertyData.booking_price_per_night,
        images: propertyData.images,
        category_id: null, // Properties don't need categories
        status: "active",
        is_active: propertyData.is_available_for_booking,
        stock_quantity: 1,
      })
      .select()
      .single()

    if (productError) throw productError

    const { data: property, error: propertyError } = await supabase
      .from("real_estate_properties")
      .insert({
        ...propertyData,
        product_id: product.id,
      })
      .select()
      .single()

    if (propertyError) throw propertyError

    return NextResponse.json({ ...property, product })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { supabase, error: authError } = await verifyAdmin()
  if (authError) return authError

  try {
    const propertyData = await request.json()
    const { id, ...updateData } = propertyData

    const { data: property, error: propertyError } = await supabase
      .from("real_estate_properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (propertyError) throw propertyError

    // Update linked product
    if (property.product_id) {
      await supabase
        .from("products")
        .update({
          name: updateData.title,
          description: updateData.description,
          price: updateData.booking_price_per_night,
          images: updateData.images,
          is_active: updateData.is_available_for_booking,
        })
        .eq("id", property.product_id)
    }

    return NextResponse.json(property)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}
