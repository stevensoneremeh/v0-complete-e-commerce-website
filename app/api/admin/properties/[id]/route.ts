import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  try {
    const { id: propertyId } = context.params
    const updates = await request.json()

    // Update property with partial data (typically status changes)
    const { data: property, error: propertyError } = await supabase
      .from("real_estate_properties")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", propertyId)
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
      .single()

    if (propertyError) throw propertyError

    // Update linked product status if property status changed
    if (updates.status && property.product_id) {
      const productStatus = updates.status === "available" ? "active" : "inactive"
      await supabase
        .from("products")
        .update({
          status: productStatus,
          is_active: updates.status === "available",
        })
        .eq("id", property.product_id)
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error updating property:", error)
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  try {
    const { id: propertyId } = context.params

    const { data: property, error } = await supabase
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
      .eq("id", propertyId)
      .single()

    if (error) throw error

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error fetching property:", error)
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  try {
    const { id: propertyId } = context.params

    // Get property to find linked product
    const { data: property } = await supabase
      .from("real_estate_properties")
      .select("product_id")
      .eq("id", propertyId)
      .single()

    // Delete property
    const { error: propertyError } = await supabase.from("real_estate_properties").delete().eq("id", propertyId)

    if (propertyError) throw propertyError

    // Delete linked product if exists
    if (property?.product_id) {
      await supabase.from("products").delete().eq("id", property.product_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete property" }, { status: 500 })
  }
}
