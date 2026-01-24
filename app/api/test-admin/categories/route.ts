import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// GET all categories (NO AUTH FOR TESTING)
export async function GET() {
  try {
    const { data: categories, error: dbError } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("[TEST] Error fetching categories:", dbError)
      return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
    }

    return NextResponse.json({ categories: categories || [] })
  } catch (error) {
    console.error("[TEST] Error in categories API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - create category (NO AUTH FOR TESTING)
export async function POST(request: NextRequest) {
  try {
    console.log("[TEST] POST /api/test-admin/categories - Request received")
    
    const body = await request.json()
    console.log("[TEST] Request body:", body)
    
    const { name, description, slug, is_active } = body

    if (!name) {
      console.log("[TEST] Name is missing")
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    console.log("[TEST] Creating category:", { name, slug, description, is_active })

    const { data: category, error: dbError } = await supabase
      .from("categories")
      .insert([
        {
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
          description: description || "",
          is_active: is_active !== false,
          status: "active",
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error("[TEST] Database error creating category:", dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    console.log("[TEST] Category created successfully:", category)
    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error("[TEST] Error in categories POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
