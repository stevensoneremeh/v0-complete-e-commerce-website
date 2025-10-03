import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/supabase-server-secure"

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Delete from Vercel Blob
    await del(url)

    return NextResponse.json({ success: true, message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
