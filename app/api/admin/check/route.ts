import { NextResponse } from "next/server"
import { checkAdminAccess } from "@/lib/admin-auth"

/**
 * Admin check endpoint
 * Returns whether the current user has admin access
 */
export async function GET() {
  try {
    const { isAdmin, user, profile } = await checkAdminAccess()

    if (!isAdmin) {
      return NextResponse.json(
        {
          isAdmin: false,
          message: "User does not have admin privileges",
        },
        { status: 403 },
      )
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user?.id,
        email: user?.email,
      },
      profile: {
        id: profile?.id,
        full_name: profile?.full_name,
        role: profile?.role,
        is_admin: profile?.is_admin,
      },
    })
  } catch (error) {
    console.error("[v0] Error checking admin access:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
