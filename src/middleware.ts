import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;
  const pathname = nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");

  console.log(`Middleware: ${pathname} | Auth: ${isLoggedIn} | Role: ${role}`);

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (isLoggedIn && isAuthPage) {
    console.log("Redirecting authenticated user from auth page to dashboard");
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protected routes (require authentication)
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/complaints") ||
    pathname.startsWith("/api/users");

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

    // Officer routes
    if (pathname.startsWith("/dashboard/officer") && role !== "OFFICER" && role !== "ADMIN") {
      console.log(`Access denied: ${role} trying to access officer route`);
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  console.log(`Middleware: Allowing access to ${pathname}`);
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/complaints/:path*",
    "/api/users/:path*",
  ],
};
