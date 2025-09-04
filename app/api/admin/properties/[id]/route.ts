import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    const propertyId = params.id

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
