import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware de redirecionamento da rota profile para a home.
 * @param request NextRequest
 * @returns NextResponse
 */
export function middleware(request: NextRequest) {
  // Redireciona /profile para a home (/)
  if (request.nextUrl.pathname === "/profile") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Intercepta apenas a rota /profile
    "/profile",
  ],
};
