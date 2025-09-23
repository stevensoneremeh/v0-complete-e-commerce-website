import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { verifyAdmin } from "../../auth/middleware"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Check admin access
  const adminCheck = await verifyAdmin(request)
  if (adminCheck) return adminCheck

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    })

    const orderData = await request.json()
    const { id } = await params

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: orderData.status,
        tracking_number: orderData.tracking,
        notes: orderData.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            images
          )
        )
      `)
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in order update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
