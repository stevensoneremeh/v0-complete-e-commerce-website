import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Protect admin routes - check for Supabase auth cookie without calling Supabase API
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("sb-access-token") || request.cookies.get("supabase-auth-token")
    
    if (!authCookie) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
