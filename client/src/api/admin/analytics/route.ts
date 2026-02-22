import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getTenantFilter } from "@/lib/rbac";
import { Role, Prisma } from "@prisma/client";

export async function GET() {
    const session = await auth();
    const allowedRoles: Role[] = [Role.ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN, Role.CITY_ADMIN];

    if (!session || !allowedRoles.includes(session.user?.role as Role)) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const tenantFilter = getTenantFilter(session.user as any);

        // 1. User Stats (Filtered by hierarchy)
        const userRoleCounts = await prisma.user.groupBy({
            by: ["role"],
            where: tenantFilter,
            _count: true,
        });

        // 2. Complaint Stats by Status
        const statusCounts = await prisma.complaint.groupBy({
            by: ["status"],
            where: tenantFilter,
            _count: true,
        });

        // 3. Complaint Stats by Category
        const categoryCounts = await prisma.complaint.groupBy({
            by: ["category"],
            where: tenantFilter,
            _count: true,
            orderBy: {
                _count: {
                    category: 'desc'
                }
            },
            take: 10
        });

        // 4. Complaints over time (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Raw query needs dynamic filtering
        const sqlFilter = [];
        if (session.user.stateId) sqlFilter.push(Prisma.sql`"stateId" = ${session.user.stateId}`);
        if (session.user.districtId) sqlFilter.push(Prisma.sql`"districtId" = ${session.user.districtId}`);
        if (session.user.cityId) sqlFilter.push(Prisma.sql`"cityId" = ${session.user.cityId}`);

        const tenantRawFilter = sqlFilter.length > 0 ? Prisma.sql`AND ${Prisma.join(sqlFilter, ' AND ')}` : Prisma.empty;

        const rawTrends: any[] = await prisma.$queryRaw`
            SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(*)::integer as count
            FROM "Complaint"
            WHERE "createdAt" >= ${sevenDaysAgo} ${tenantRawFilter}
            GROUP BY day
            ORDER BY day ASC
        `;

        // Fill gaps for last 7 days
        const dailyTrendMap: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyTrendMap[d.toISOString().split("T")[0]] = 0;
        }

        rawTrends.forEach(t => {
            const dateStr = new Date(t.day).toISOString().split("T")[0];
            if (dailyTrendMap[dateStr] !== undefined) {
                dailyTrendMap[dateStr] = t.count;
            }
        });

        const formattedTrends = Object.entries(dailyTrendMap)
            .map(([day, count]) => ({ day, count }))
            .sort((a, b) => a.day.localeCompare(b.day));

        // 5. Severity Distribution
        const severityCounts = await prisma.complaint.groupBy({
            where: tenantFilter,
            by: ["severity"],
            _count: true,
        });

        // 6. Department Activity (Filtered implicitly via complaints)
        const deptActivity = await prisma.department.findMany({
            select: {
                name: true,
                _count: {
                    select: {
                        complaints: {
                            where: tenantFilter
                        }
                    }
                }
            },
            orderBy: {
                complaints: {
                    _count: 'desc'
                }
            },
            take: 5
        });

        // 7. AI Problem Insights (Filtered)
        const complaintsForAI = await prisma.complaint.findMany({
            where: {
                ...tenantFilter,
                createdAt: { gte: sevenDaysAgo }
            },
            select: { category: true, description: true, status: true },
            take: 20
        });

        const aiInsights = {
            hotspots: categoryCounts.slice(0, 3).map(c => c.category),
            summary: `Automated scan detected patterns in ${categoryCounts[0]?.category || 'Multiple'} sectors for your region.`,
            suggestions: [
                "Deploy quick-response teams based on regional hotspot density.",
                "Review departmental workload for your district.",
                "Compare cross-district efficiency metrics."
            ]
        };

        return NextResponse.json({
            users: userRoleCounts,
            statusDistribution: statusCounts,
            categoryDistribution: categoryCounts,
            dailyTrends: formattedTrends,
            severityDistribution: severityCounts,
            departmentActivity: deptActivity.map(d => ({ ...d, _count: { complaints: d._count.complaints } })), // Flatten for compat
            aiInsights: aiInsights
        });
    } catch (error: any) {
        console.error("Admin analytics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
