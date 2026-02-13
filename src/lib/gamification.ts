import prisma from "@/lib/prisma";

/**
 * Updates citizen points based on successful verification of a complaint.
 */
export async function awardCivicPoints(userId: string, points: number = 50) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            points: { increment: points }
        }
    });
}

/**
 * Fetches the top contributors for the leaderboard.
 */
export async function getLeaderboard() {
    return await prisma.user.findMany({
        where: { role: 'CITIZEN' },
        orderBy: { points: 'desc' },
        take: 10,
        select: {
            name: true,
            points: true,
            _count: {
                select: { complaints: true }
            }
        }
    });
}
