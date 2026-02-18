import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET 
  });
  const isAdmin = (token as any)?.role === "ADMIN";
  const isOfficer = (token as any)?.role === "OFFICER";
  const isCitizen = (token as any)?.role === "CITIZEN";

  const pathname = req.nextUrl.pathname;

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Officer-only routes (only officers, not admins)
  if (pathname.startsWith("/dashboard/officer") && !isOfficer) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protected routes (require authentication)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/complaints") ||
    pathname.startsWith("/api/users")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/complaints/:path*",
    "/api/users/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/officer/:path*",
  ],
};
