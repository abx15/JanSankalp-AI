import prisma from "./prisma";

/**
 * Calculates a refined severity score based on AI analysis and local context.
 */
export function calculateSeverity(
    aiSeverity: number,
    sentiment: number,
    keywordWeight: number,
    duplicateDensity: number
): number {
    const wAi = 0.4;
    const wSentiment = 0.2;
    const wKeywords = 0.25;
    const wDensity = 0.15;

    const rawScore =
        (aiSeverity / 5 * wAi) +
        (sentiment * wSentiment) +
        (keywordWeight * wKeywords) +
        (Math.min(duplicateDensity / 5, 1) * wDensity);

    return Math.max(1, Math.min(5, Math.ceil(rawScore * 5)));
}

/**
 * Finds duplicates within 200m using bounding box logic.
 */
export async function findNearbyDuplicates(latitude: number, longitude: number, category: string) {
    const radius = 200;
    const latDelta = radius / 111000;
    const lngDelta = radius / (111000 * Math.cos(latitude * Math.PI / 180));

    const nearby = await prisma.complaint.findMany({
        where: {
            category,
            latitude: { gte: latitude - latDelta, lte: latitude + latDelta },
            longitude: { gte: longitude - lngDelta, lte: longitude + lngDelta },
            status: { not: 'RESOLVED' }
        }
    });

    return nearby;
}

/**
 * Checks for urgency keywords in the text.
 */
export function getKeywordWeight(text: string): number {
    const urgentKeywords = ["emergency", "danger", "flooding", "broken wire", "accident", "hospital", "blocking road"];
    const lowerText = text.toLowerCase();
    const matchCount = urgentKeywords.filter(k => lowerText.includes(k)).length;
    return Math.min(matchCount * 0.4, 1);
}
