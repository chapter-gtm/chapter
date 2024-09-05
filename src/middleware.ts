import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const publicUrls = ["/reset-password"];

  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    // Redirect to /opportunities
    return NextResponse.rewrite(new URL("/dashboard", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|error|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
