import prisma from "@/data/prisma";

export class SovereignRepository {
    async getCitizenCount() {
        return prisma.user.count({
            where: { role: "CITIZEN" },
        });
    }

    async getResolvedIssuesCount() {
        return prisma.complaint.count({
            where: { status: "RESOLVED" },
        });
    }

    async getCityCount() {
        return prisma.city.count();
    }

    async getSDGTargets(take = 5) {
        return (prisma as any).sDGTarget.findMany({
            take,
            orderBy: { goalNumber: "asc" },
        });
    }

    async getDigitalTwinNodes(take = 6) {
        return (prisma as any).digitalTwinNode.findMany({
            take,
            orderBy: { healthScore: "desc" },
        });
    }

    async getNationalCrises(status: "ACTIVE" | "RESOLVED" = "ACTIVE", take = 5) {
        return (prisma as any).nationalCrisis.findMany({
            where: { status },
            take,
        });
    }

    async getTenantCount() {
        return (prisma as any).tenant.count();
    }
}

export const sovereignRepository = new SovereignRepository();
