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

        const pendingComplaints = await prisma.complaint.findMany({
            where: { status: "PENDING" },
            include: { author: { select: { name: true, email: true } } },
            take: 10,
        });

        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";
        const results = [];

        for (const complaint of pendingComplaints) {
            try {
                // Use AI Engine for Classification and Severity
                const classifyResp = await fetch(`${AI_SERVICE_URL}/classify`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: complaint.description }),
                });

                if (!classifyResp.ok) throw new Error("AI Engine Classify Failed");
                const analysis = await classifyResp.json();

                // If severity is critical or confidence is high, try to auto-resolve or mark priority
                if (analysis.confidence > 0.9 && analysis.severity === "Critical") {
                    await prisma.complaint.update({
                        where: { id: complaint.id },
                        data: {
                            status: "RESOLVED",
                            translatedText: analysis.reasoning,
                            confidenceScore: analysis.confidence
                        }
                    });

                    if (complaint.author.email) {
                        await notifyResolutionWithAI({
                            userId: complaint.authorId,
                            userEmail: complaint.author.email,
                            userName: complaint.author.name || "Citizen",
                            complaintId: complaint.id,
                            ticketId: complaint.ticketId,
                            resolutionDetails: analysis.reasoning,
                            complaintTitle: complaint.title
                        });
                    }
                    results.push({ id: complaint.id, status: "RESOLVED", reason: analysis.reasoning });
                } else {
                    results.push({ id: complaint.id, status: "MANUAL_PENDING", reason: "Needs human review" });
                }
            } catch (err: any) {
                console.error(`Error processing complaint ${complaint.id}:`, err.message);
                results.push({ id: complaint.id, status: "ERROR", reason: err.message });
            }
        }

        return NextResponse.json({
            message: `Processed ${pendingComplaints.length} complaints via AI Engine.`,
            results
        });

    } catch (error: any) {
        console.error("AI_PROCESS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
