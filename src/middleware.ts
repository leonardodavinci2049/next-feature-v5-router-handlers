
import { NextRequest, NextResponse } from "next/server";


/**
 * Middleware de redirecionamento para perfil do usuário.
 * @param request NextRequest
 * @returns NextResponse
 */
export function middleware(request: NextRequest) {
    return NextResponse.redirect(new URL("/profile", request.url));
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/profile",
  ],
};
