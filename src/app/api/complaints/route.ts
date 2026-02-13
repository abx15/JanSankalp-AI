import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { analyzeComplaint, detectAndTranslate } from "@/lib/ai-service";
import { calculateSeverity, findNearbyDuplicates, getKeywordWeight } from "@/lib/intelligence";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const isAdmin = session.user.role === "ADMIN";

        const complaints = await prisma.complaint.findMany({
            where: isAdmin ? {} : { authorId: session.user.id },
            include: {
                author: { select: { name: true } },
                department: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ complaints });
    } catch (error) {
        console.error("COMPLAINTS_GET_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, imageUrl, latitude, longitude, authorId } = body;

        // 1. Language Detection & Translation
        const { originalLanguage, translatedText } = await detectAndTranslate(description);

        // 2. AI Image/Text Classification
        const aiAnalysis = await analyzeComplaint(translatedText, imageUrl);

        // 3. Duplicate Detection
        const duplicates = await findNearbyDuplicates(latitude, longitude, aiAnalysis.category);
        const duplicateOf = duplicates.length > 0 ? duplicates[0].id : null;

        // 4. Refined Severity Scoring
        const kwWeight = getKeywordWeight(translatedText);
        const finalSeverity = calculateSeverity(
            aiAnalysis.severity,
            aiAnalysis.sentiment,
            kwWeight,
            duplicates.length
        );

        const complaint = await prisma.complaint.create({
            data: {
                title: aiAnalysis.category + " reported",
                description,
                originalText: description,
                originalLanguage,
                translatedText,
                category: aiAnalysis.category,
                severity: finalSeverity,
                confidenceScore: aiAnalysis.confidence,
                imageUrl,
                latitude,
                longitude,
                authorId,
                duplicateOf,
            },
            include: {
                author: { select: { name: true } },
            }
        });

        // 5. Real-time Notification for Officers/Admins
        await pusherServer.trigger("governance-channel", "new-complaint", {
            id: complaint.id,
            category: complaint.category,
            severity: complaint.severity,
            location: { lat: latitude, lng: longitude },
        });

        return NextResponse.json({ complaint });
    } catch (error) {
        console.error("COMPLAINT_SUBMIT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
