import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // 1. User Stats
        const userRoleCounts = await prisma.user.groupBy({
            by: ["role"],
            _count: true,
        });

        // 2. Complaint Stats by Status
        const statusCounts = await prisma.complaint.groupBy({
            by: ["status"],
            _count: true,
        });

        // 3. Complaint Stats by Category
        const categoryCounts = await prisma.complaint.groupBy({
            by: ["category"],
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

        // Get trends and convert BigInt to Number for JSON serialization
        const rawTrends: any[] = await prisma.$queryRaw`
            SELECT DATE_TRUNC('day', "createdAt") as day, COUNT(*)::integer as count
            FROM "Complaint"
            WHERE "createdAt" >= ${sevenDaysAgo}
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
            by: ["severity"],
            _count: true,
        });

        // 6. Department Activity
        const deptActivity = await prisma.department.findMany({
            select: {
                name: true,
                _count: {
                    select: { complaints: true }
                }
            },
            orderBy: {
                complaints: {
                    _count: 'desc'
                }
            },
            take: 5
        });

        // 7. AI Problem Insights
        const complaintsForAI = await prisma.complaint.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { category: true, description: true, status: true },
            take: 20
        });

        const aiInsights = {
            hotspots: categoryCounts.slice(0, 3).map(c => c.category),
            summary: `Automated scan detected high volume in ${categoryCounts[0]?.category || 'Multiple'} sectors. Recommend immediate department allocation.`,
            suggestions: [
                "Deploy quick-response teams to high-density garbage zones.",
                "Review PWD routing for efficient pothole patching.",
                "Verify water leakage reports against aging infrastructure maps."
            ]
        };

        return NextResponse.json({
            users: userRoleCounts,
            statusDistribution: statusCounts,
            categoryDistribution: categoryCounts,
            dailyTrends: formattedTrends,
            severityDistribution: severityCounts,
            departmentActivity: deptActivity,
            aiInsights: aiInsights
        });
    } catch (error: any) {
        console.error("Admin analytics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
