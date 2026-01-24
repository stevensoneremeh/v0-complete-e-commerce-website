import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[TEST] Connection test starting...")
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log("[TEST] URL exists:", !!url)
    console.log("[TEST] Key exists:", !!key)
    
    if (!url || !key) {
      return NextResponse.json({
        status: "error",
        message: "Missing env vars",
        hasUrl: !!url,
        hasKey: !!key,
      }, { status: 500 })
    }

    const supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    console.log("[TEST] Supabase client created")

    // Try to fetch categories
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .limit(1)

    console.log("[TEST] Query result:", { dataCount: data?.length, error })

    if (error) {
      return NextResponse.json({
        status: "error",
        message: "Database query failed",
        error: error.message,
      }, { status: 500 })
    }

    return NextResponse.json({
      status: "success",
      message: "Connection successful",
      categoriesCount: data?.length || 0,
    })
  } catch (error) {
    console.error("[TEST] Connection test error:", error)
    return NextResponse.json({
      status: "error",
      message: String(error),
    }, { status: 500 })
  }
}
