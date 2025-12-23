import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Skip Supabase operations if environment variables are not available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('[middleware] Skipping session update - env vars not available')
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      return NextResponse.redirect(url)
    }

    if (supabaseServiceKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js")
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        })

        const { data: profile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("is_admin, role")
          .eq("id", user.id)
          .single()

        // If admin check fails, deny access
        if (profileError || !profile) {
          const url = request.nextUrl.clone()
          url.pathname = "/"
          return NextResponse.redirect(url)
        }

        const isAdmin = profile.is_admin === true || profile.role === "admin"
        if (!isAdmin) {
          const url = request.nextUrl.clone()
          url.pathname = "/"
          return NextResponse.redirect(url)
        }
      } catch (error) {
        console.error("[Middleware] Error verifying admin status:", error)
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    }
    // If no service key, let the admin layout handle the check
  }

  return supabaseResponse
}
