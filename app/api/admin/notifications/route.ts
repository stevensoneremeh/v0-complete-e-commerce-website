import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/auth/admin-guard"

export async function GET() {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const { data: notifications, error: dbError } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })

    if (dbError) {
      console.error("Error fetching notifications:", dbError)
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error in notifications API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, error: authError } = await verifyAdmin()
    if (authError) return authError

    const notificationData = await request.json()

    const { data: notification, error: dbError } = await supabase
      .from("notifications")
      .insert([notificationData])
      .select()
      .single()

    if (dbError) {
      console.error("Error creating notification:", dbError)
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error in notifications POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
