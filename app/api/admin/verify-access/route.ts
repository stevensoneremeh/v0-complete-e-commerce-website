import { checkAdminAccess } from "@/lib/auth/check-admin"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
            }
          },
        },
      },
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        authenticated: false,
        profileExists: false,
        isAdmin: false,
        error: "Not authenticated. Please log in first.",
      })
    }

    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      },
    )

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    const url = new URL(request.url)
    const shouldFix = url.searchParams.get("fix") === "true"

    if (shouldFix && user.email === "talktostevenson@gmail.com") {
      if (!profile) {
        const { error: insertError } = await supabaseAdmin.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "Admin User",
          is_admin: true,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) {
          return NextResponse.json({
            authenticated: true,
            userId: user.id,
            email: user.email,
            profileExists: false,
            isAdmin: false,
            error: `Failed to create profile: ${insertError.message}`,
          })
        }

        return NextResponse.json({
          authenticated: true,
          userId: user.id,
          email: user.email,
          profileExists: true,
          isAdmin: true,
          role: "admin",
          fixed: true,
        })
      } else if (profile.is_admin !== true || profile.role !== "admin") {
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            is_admin: true,
            role: "admin",
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (updateError) {
          return NextResponse.json({
            authenticated: true,
            userId: user.id,
            email: user.email,
            profileExists: true,
            isAdmin: false,
            role: profile.role,
            error: `Failed to update profile: ${updateError.message}`,
          })
        }

        return NextResponse.json({
          authenticated: true,
          userId: user.id,
          email: user.email,
          profileExists: true,
          isAdmin: true,
          role: "admin",
          fixed: true,
        })
      }
    }

    if (profileError) {
      return NextResponse.json({
        authenticated: true,
        userId: user.id,
        email: user.email,
        profileExists: false,
        isAdmin: false,
        error: `Profile check failed: ${profileError.message}`,
      })
    }

    if (!profile) {
      return NextResponse.json({
        authenticated: true,
        userId: user.id,
        email: user.email,
        profileExists: false,
        isAdmin: false,
        error: "Profile not found in database.",
      })
    }

    const isAdmin = profile.is_admin === true || profile.role === "admin"

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      email: user.email,
      profileExists: true,
      isAdmin,
      role: profile.role,
    })
  } catch (error) {
    console.error("[v0] Diagnostic error:", error)
    return NextResponse.json({
      authenticated: false,
      profileExists: false,
      isAdmin: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    })
  }
}
