import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { analyzeComplaint, detectAndTranslate } from "@/lib/ai-service";
import { calculateSeverity, findNearbyDuplicates, getKeywordWeight } from "@/lib/intelligence";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";
import { sendComplaintConfirmationEmail } from "@/lib/email-service";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            console.log("COMPLAINTS_GET_UNAUTHORIZED");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const role = session.user.role;
        const isAdmin = role === "ADMIN";

        console.log("COMPLAINTS_GET_REQUEST", {
            userId: session.user.id,
            role,
            isAdmin
        });

        const complaints = await prisma.complaint.findMany({
            where: isAdmin ? {} : { authorId: session.user.id },
            include: {
                author: { select: { name: true } },
                department: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" }
        });

        console.log(`COMPLAINTS_GET_SUCCESS: Found ${complaints.length} complaints`);
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

        if (!authorId) {
            return new NextResponse("Missing authorId", { status: 400 });
        }

        const ticketId = `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "https://jansankalp-ai.onrender.com";

        // --- Autonomous AI Workflow ---
        console.log(`[AI-WORKFLOW] Starting for Ticket: ${ticketId}`);

        let aiResult: any = null;
        try {
            const aiResponse = await fetch(`${AI_SERVICE_URL}/process-workflow`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    complaint_id: ticketId,
                    text: description,
                    latitude,
                    longitude
                }),
            });

            if (aiResponse.ok) {
                aiResult = await aiResponse.json();
                console.log("[AI-WORKFLOW] Result:", aiResult);
            }
        } catch (aiError: any) {
            console.error("[AI-WORKFLOW] Service unreachable, falling back to basic processing:", aiError.message);
        }

        const status = aiResult?.status === "REJECTED_SPAM" ? "REJECTED" :
            (aiResult?.assigned_officer ? "IN_PROGRESS" : "PENDING");

        // Save to Database
        const complaint = await prisma.complaint.create({
            data: {
                ticketId,
                title: aiResult?.analysis?.category ? `${aiResult.analysis.category} Issue` : (title || "Civic Issue"),
                description,
                originalText: description,
                status,
                category: aiResult?.analysis?.category || "General",
                severity: aiResult?.analysis?.severity ?
                    (aiResult.analysis.severity === "Critical" ? 5 :
                        aiResult.analysis.severity === "High" ? 4 :
                            aiResult.analysis.severity === "Medium" ? 3 : 2) : 1,
                confidenceScore: aiResult?.analysis?.confidence || 0.5,
                imageUrl,
                latitude,
                longitude,
                authorId,
                assignedToId: aiResult?.assigned_officer || null,
                duplicateOf: aiResult?.is_duplicate ? "DUPLICATE_FOUND" : null, // Simplification for now
                aiAnalysis: aiResult ? {
                    category: aiResult.analysis.category,
                    reasoning: aiResult.analysis.reasoning,
                    confidence: aiResult.analysis.confidence,
                    eta_days: aiResult.eta_days
                } : null,
                spamScore: aiResult?.is_spam ? 1.0 : 0.0,
                isDuplicate: aiResult?.is_duplicate || false,
            } as any,
            include: {
                author: { select: { name: true, email: true } },
            }
        });

        // Notifications
        try {
            await pusherServer.trigger("governance-channel", "new-complaint", {
                id: complaint.id,
                ticketId: complaint.ticketId,
                category: complaint.category,
                status: complaint.status,
                location: { lat: latitude, lng: longitude }
            });

            const { notifyComplaintRegistered } = await import("@/lib/notification-service");
            await notifyComplaintRegistered({
                userId: complaint.authorId,
                userEmail: complaint.author?.email || "",
                userName: complaint.author?.name || "Citizen",
                complaintId: complaint.id,
                ticketId: complaint.ticketId,
                category: complaint.category,
                location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            });
        } catch (err) {
            console.error("[NOTIFY] Error:", err);
        }

        return NextResponse.json({
            complaint,
            aiSummary: aiResult ? {
                status: aiResult.status,
                isSpam: aiResult.is_spam,
                isDuplicate: aiResult.is_duplicate,
                eta: aiResult.eta_days
            } : null
        });

    } catch (error: any) {
        console.error("COMPLAINT_POST_ERROR", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
