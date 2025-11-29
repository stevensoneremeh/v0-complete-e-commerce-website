import { checkAdminAccess } from "@/lib/auth/check-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { isAdmin, user, error } = await checkAdminAccess()

    if (!isAdmin) {
      return NextResponse.json({ isAdmin: false, error: error || "Not authorized" }, { status: 401 })
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user?.id,
        email: user?.email,
      },
    })
  } catch (error) {
    console.error("[v0] Verify access error:", error)
    return NextResponse.json({ isAdmin: false, error: "Failed to verify access" }, { status: 500 })
  }
}
