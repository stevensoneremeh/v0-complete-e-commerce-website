
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    if (testError) {
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        error: testError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      status: "success",
      message: "Admin API is functional",
      timestamp: new Date().toISOString(),
      database: "connected"
    })

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
