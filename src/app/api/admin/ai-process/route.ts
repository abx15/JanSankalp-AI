import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { notifyResolutionWithAI } from "@/lib/notification-service";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch complaints that haven't been processed by the new AI Engine
        const unprocessedComplaints = await (prisma.complaint as any).findMany({
            where: { aiAnalysis: null },
            take: 20, // Process in batches
        });

        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://jansankalp-ai.onrender.com";
        const results = [];

        for (const complaint of unprocessedComplaints) {
            try {
                const aiResponse = await fetch(`${AI_SERVICE_URL}/process-workflow`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        complaint_id: (complaint as any).ticketId,
                        text: (complaint as any).description,
                        latitude: (complaint as any).latitude,
                        longitude: (complaint as any).longitude
                    }),
                });

                if (aiResponse.ok) {
                    const aiResult = await aiResponse.json();

                    await (prisma.complaint as any).update({
                        where: { id: (complaint as any).id },
                        data: {
                            aiAnalysis: {
                                category: aiResult.analysis.category,
                                reasoning: aiResult.analysis.reasoning,
                                confidence: aiResult.analysis.confidence,
                                eta_days: aiResult.eta_days
                            } as any,
                            category: aiResult.analysis.category,
                            status: aiResult.status === "REJECTED_SPAM" ? "REJECTED" :
                                (aiResult.assigned_officer ? "IN_PROGRESS" : (complaint as any).status),
                            assignedToId: aiResult.assigned_officer || (complaint as any).assignedToId,
                            spamScore: aiResult.is_spam ? 1.0 : 0.0,
                            isDuplicate: aiResult.is_duplicate || false,
                        }
                    });

                    results.push({ id: complaint.id, status: "SUCCESS" });
                }
            } catch (err: any) {
                console.error(`Error processing ${complaint.id}:`, err.message);
                results.push({ id: complaint.id, status: "ERROR", error: err.message });
            }
        }

        return NextResponse.json({
            message: `Processed ${unprocessedComplaints.length} complaints.`,
            results
        });

    } catch (error: any) {
        console.error("AI_PROCESS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
