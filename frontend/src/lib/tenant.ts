import prisma from "./prisma";

export async function getTenantBySubdomain(subdomain: string) {
    if (!subdomain || subdomain === "www" || subdomain === "localhost") return null;

    return await (prisma as any).tenant.findUnique({
        where: { subdomain },
        include: {
            subscription: true,
        },
    });
}

export async function getTenantById(id: string) {
    return await (prisma as any).tenant.findUnique({
        where: { id },
        include: {
            subscription: true,
        },
    });
}

/**
 * Validates if the current request is for a valid tenant.
 * In a real SaaS, this would check against the database or a cache.
 */
export function parseSubdomain(host: string) {
    const parts = host.split(".");
    if (parts.length > 2) {
        return parts[0];
    }
    return null;
}
