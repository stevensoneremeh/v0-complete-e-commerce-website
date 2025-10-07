import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET() {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: coupons, error: dbError } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching coupons:", dbError)
      return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
    }

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Error in coupons API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const couponData = await request.json()

    const { data: coupon, error: dbError } = await supabase
      .from("coupons")
      .insert([couponData])
      .select()
      .single()

    if (dbError) {
      console.error("Error creating coupon:", dbError)
      return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
    }

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error("Error in coupons POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
