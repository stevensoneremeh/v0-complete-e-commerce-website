import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Admin route protection (basic check)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // In production, implement proper authentication check
    // For now, this is just a placeholder
    const isAuthenticated = request.cookies.get("auth-token")

    if (!isAuthenticated && request.nextUrl.pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
