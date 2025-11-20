import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Skip Supabase operations if environment variables are not available
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create service role client - this bypasses RLS
  const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
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
    // Allow access to /admin/access for diagnostics
    if (request.nextUrl.pathname === "/admin/access") {
      console.log("[Middleware] Allowing access to /admin/access")
      return supabaseResponse
    }

    if (!user) {
      console.warn("[Middleware] No user found, redirecting to auth")
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    console.log("[Middleware] User authenticated:", user.email, "User ID:", user.id)

    try {
      // Use service role to bypass RLS and avoid infinite recursion
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin, role, email")
        .eq("id", user.id)
        .maybeSingle()

      console.log("[Middleware] Profile query result:", { profile, error: profileError?.message })

      // If profile doesn't exist or query fails, redirect to access page
      if (profileError) {
        console.error("[Middleware] Profile query error:", profileError.message, profileError.details)
        const url = request.nextUrl.clone()
        url.pathname = "/admin/access"
        return NextResponse.redirect(url)
      }

      if (!profile) {
        console.warn("[Middleware] No profile found for user:", user.id, user.email)
        const url = request.nextUrl.clone()
        url.pathname = "/admin/access"
        return NextResponse.redirect(url)
      }

      const isAdmin = profile.is_admin === true || profile.role === "admin"
      console.log("[Middleware] Admin check:", { 
        email: user.email, 
        is_admin: profile.is_admin, 
        role: profile.role, 
        isAdmin 
      })
      
      if (!isAdmin) {
        console.warn("[Middleware] User is not admin:", user.email, "is_admin:", profile.is_admin, "role:", profile.role)
        const url = request.nextUrl.clone()
        url.pathname = "/admin/access"
        return NextResponse.redirect(url)
      }

      // Admin access granted
      console.log("[Middleware] ✅ Admin access granted:", user.email)
    } catch (error) {
      console.error("[Middleware] Unexpected error verifying admin:", error)
      const url = request.nextUrl.clone()
      url.pathname = "/admin/access"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
