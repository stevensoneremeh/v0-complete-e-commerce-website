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

    const customerData = await request.json()
    const { id } = await params

    // Update profile
    const { data: customer, error } = await supabase
      .from("profiles")
      .update({
        full_name: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        country: customerData.country,
        role: customerData.role,
        is_admin: customerData.role === "admin",
        is_active: customerData.isActive !== undefined ? customerData.isActive : true,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating customer:", error)
      return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
    }

    // If changing admin status or disabling user, update auth user metadata
    if (customerData.role !== undefined || customerData.isActive !== undefined) {
      await supabase.auth.admin.updateUserById(id, {
        user_metadata: {
          role: customerData.role,
          is_admin: customerData.role === "admin",
        },
        ban_duration: customerData.isActive === false ? "876000h" : "none", // Ban for 100 years if inactive
      })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error("Error in customer update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params

    // Delete user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id)
    if (authError) {
      console.error("Error deleting auth user:", authError)
      return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 })
    }

    return NextResponse.json({ message: "Customer deleted successfully" })
  } catch (error) {
    console.error("Error in customer deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
