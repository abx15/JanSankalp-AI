import { Role } from "@prisma/client";

export interface UserScope {
    role: Role;
    stateId?: string | null;
    districtId?: string | null;
    cityId?: string | null;
    wardId?: string | null;
}

/**
 * Hierarchical RBAC Logic
 * Determines if a user can access data within a specific geographic scope.
 */
export function checkAccess(user: UserScope, target: {
    stateId?: string | null;
    districtId?: string | null;
    cityId?: string | null;
    wardId?: string | null;
}): boolean {
    // 1. Global Admin can access everything
    if (user.role === Role.ADMIN) return true;

    // 2. State Admin: Must match stateId
    if (user.role === Role.STATE_ADMIN) {
        return !!(user.stateId && user.stateId === target.stateId);
    }

    // 3. District Admin: Must match districtId
    if (user.role === Role.DISTRICT_ADMIN) {
        return !!(user.districtId && user.districtId === target.districtId);
    }

    // 4. City Admin: Must match cityId
    if (user.role === Role.CITY_ADMIN) {
        return !!(user.cityId && user.cityId === target.cityId);
    }

    // 5. Officer: Scoped to their assigned area (usually district or city)
    if (user.role === Role.OFFICER) {
        if (target.districtId) return user.districtId === target.districtId;
        if (target.cityId) return user.cityId === target.cityId;
        return false;
    }

    // 6. Citizen: Only their own data (handled by ownership checks elsewhere)
    return false;
}

/**
 * Returns Prisma 'where' conditions based on user scope
 */
export function getTenantFilter(user: UserScope) {
    if (user.role === Role.ADMIN) return {};

    if (user.role === Role.STATE_ADMIN) {
        return { stateId: user.stateId };
    }

    if (user.role === Role.DISTRICT_ADMIN) {
        return { districtId: user.districtId };
    }

    if (user.role === Role.CITY_ADMIN) {
        return { cityId: user.cityId };
    }

    if (user.role === Role.OFFICER) {
        // Officers usually see their district
        return { districtId: user.districtId };
    }

    return { authorId: (user as any).id }; // Default for citizens
}
