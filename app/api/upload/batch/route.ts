import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/supabase-server-secure"

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await verifyAdmin()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const folder = (formData.get("folder") as string) || "general"

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate file count (max 10 files at once)
    if (files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 files allowed per upload" }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    const uploadedFiles = []

    for (const file of files) {
      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: `File ${file.name} exceeds 10MB limit`,
          },
          { status: 400 },
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
      const filename = `${folder}/${timestamp}-${random}-${sanitizedName}`

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
      })

      uploadedFiles.push({
        url: blob.url,
        filename: file.name,
        size: file.size,
        type: file.type,
        pathname: blob.pathname,
      })
    }

    return NextResponse.json({
      files: uploadedFiles,
      count: uploadedFiles.length,
    })
  } catch (error) {
    console.error("Batch upload error:", error)
    return NextResponse.json({ error: "Batch upload failed" }, { status: 500 })
  }
}
