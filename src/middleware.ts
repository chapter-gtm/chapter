import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const supabase = createClient();

  const publicUrls = ["/reset-password"];

  if (publicUrls.includes(request.nextUrl.pathname)) {
    return response;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/") {
    // Redirect to /dashboard
    return NextResponse.rewrite(new URL("/surveys", request.url));
  }

  return response;
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
