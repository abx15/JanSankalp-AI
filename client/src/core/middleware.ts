/**
 * CORE — Reusable Auth Guard Middleware Helpers
 *
 * Provides guard utilities used inside controllers to enforce
 * authentication and authorization without duplicating code.
 *
 * MVDC: C = Controller (supporting utilities)
 */
import { auth } from "@/auth";
import { AppError } from "@/core/error-handler";

export type UserRole =
    | "CITIZEN"
    | "ADMIN"
    | "STATE_ADMIN"
    | "DISTRICT_ADMIN"
    | "DEPARTMENT_HEAD"
    | "FIELD_OFFICER";

/** Require any authenticated session. Returns the session or throws 401. */
export async function requireAuth() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new AppError("Unauthorized: Please sign in to continue", 401, "UNAUTHORIZED");
    }
    return session;
}

/**
 * Require an authenticated session AND that the user has one of the
 * allowed roles. Returns the session or throws 401/403.
 */
export async function requireRole(...allowedRoles: UserRole[]) {
    const session = await requireAuth();
    const userRole = session.user?.role as UserRole | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
        throw new AppError(
            `Forbidden: Requires one of [${allowedRoles.join(", ")}] role`,
            403,
            "FORBIDDEN"
        );
    }

    return session;
}

/** Shorthand — require ADMIN role. */
export async function requireAdmin() {
    return requireRole("ADMIN");
}

/** Shorthand — require any admin-tier role. */
export async function requireAnyAdmin() {
    return requireRole("ADMIN", "STATE_ADMIN", "DISTRICT_ADMIN");
}
