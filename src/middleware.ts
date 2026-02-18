import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET
  });

  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/auth");

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protected routes (require authentication)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/complaints") ||
    pathname.startsWith("/api/users");

  if (isProtectedRoute && !token) {
    const searchParams = new URLSearchParams(req.nextUrl.search);
    searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(new URL(`/auth/signin?${searchParams.toString()}`, req.url));
  }

  // Role-based access control
  if (token) {
    const role = (token as any)?.role;

    // Redirect from generic /dashboard to role-specific dashboard
    if (pathname === "/dashboard") {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      if (role === "OFFICER") {
        return NextResponse.redirect(new URL("/dashboard/officer", req.url));
      }
    }

    // Admin-only routes
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Officer routes
    if (pathname.startsWith("/dashboard/officer") && role !== "OFFICER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
