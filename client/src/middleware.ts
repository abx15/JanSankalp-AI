import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const pathname = nextUrl.pathname;
  const hostname = req.headers.get("host") || "";

  // Multi-tenant subdomain resolution
  const parts = hostname.split(".");
  const subdomain = parts.length > 1 && parts[parts.length - 2] !== "localhost" && parts[0] !== "www" ? parts[0] : null;

  console.log(`Middleware: ${pathname} | Host: ${hostname} | Tenant: ${subdomain || "Global"} | Auth: ${isLoggedIn} | Role: ${role}`);

  // Internal rewrite for tenant-specific routes if needed
  // For this architecture, we keep the URL same but inject tenant info into headers
  const response = NextResponse.next();
  if (subdomain) {
    response.headers.set("x-tenant-slug", subdomain);
  }

  const isAuthPage = pathname.startsWith("/auth");

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (isLoggedIn && isAuthPage) {
    console.log("Redirecting authenticated user from auth page to dashboard");
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protected routes (require authentication)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/complaints") ||
    pathname.startsWith("/api/users") ||
    pathname.startsWith("/api/admin");

  if (isProtectedRoute && !isLoggedIn) {
    console.log("Redirecting unauthenticated user to signin");
    const searchParams = new URLSearchParams(nextUrl.search);
    searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(new URL(`/auth/signin?${searchParams.toString()}`, nextUrl));
  }

  // Role-based access control
  if (isLoggedIn) {
    // Redirect from generic /dashboard to role-specific dashboard
    if (pathname === "/dashboard") {
      console.log(`Redirecting ${role} to role-specific dashboard`);
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", nextUrl));
      }
      if (role === "OFFICER") {
        return NextResponse.redirect(new URL("/dashboard/officer", nextUrl));
      }
    }

    // Admin-only routes
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      console.log(`Access denied: ${role} trying to access admin route`);
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return response;
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/complaints/:path*",
    "/api/users/:path*",
  ],
};
