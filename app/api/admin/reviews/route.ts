import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: reviews, error: dbError } = await supabase
      .from("product_reviews")
      .select(`
        *,
        products (name),
        profiles (full_name, email)
      `)
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching reviews:", dbError)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
