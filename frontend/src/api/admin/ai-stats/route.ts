import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const totalComplaints = await prisma.complaint.count();
        const aiProcessed = await (prisma.complaint as any).count({
            where: { NOT: { aiAnalysis: null } }
        });
        const duplicates = await (prisma.complaint as any).count({
            where: { isDuplicate: true }
        });
        const spamRejected = await (prisma.complaint as any).count({
            where: { status: "REJECTED", spamScore: { gt: 0.5 } }
        });
        const autoRouted = await (prisma.complaint as any).count({
            where: { status: "IN_PROGRESS", NOT: { assignedToId: null } }
        });

        // Mocking some data for charts that would normally come from aggregations
        const stats = {
            totalComplaints,
            aiProcessed,
            duplicates,
            spamRejected,
            autoRouted,
            averageConfidence: 0.92,
            deptDistribution: {
                "Roads": 45,
                "Water": 32,
                "Sanitation": 28,
                "Others": 15
            },
            severityStats: {
                "Critical": 12,
                "High": 25,
                "Medium": 45,
                "Low": 18
            }
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("AI_STATS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
