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
        console.log("RECEIVED_COMPLAINT_BODY:", body);
        const { title, description, imageUrl, latitude, longitude, authorId } = body;

        if (!authorId) {
            console.error("MISSING_AUTHOR_ID");
            return new NextResponse("Missing authorId", { status: 400 });
        }

        // 0. Generate Unique Ticket ID: JSK-YYYY-XXXXX
        const ticketId = `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        console.log("GENERATED_TICKET_ID:", ticketId);

        // 1. Language Detection & Translation
        console.log("STARTING_AI_TRANSLATION...");
        const { originalLanguage, translatedText } = await detectAndTranslate(description);
        console.log("AI_TRANSLATION_DONE:", { originalLanguage, translatedText });

        // 2. AI Image/Text Classification
        console.log("STARTING_AI_ANALYSIS...");
        const aiAnalysis = await analyzeComplaint(translatedText, imageUrl);
        console.log("AI_ANALYSIS_DONE:", aiAnalysis);

        // 3. Duplicate Detection
        console.log("CHECKING_DUPLICATES...");
        const duplicates = await findNearbyDuplicates(latitude, longitude, aiAnalysis.category);
        const duplicateOf = duplicates.length > 0 ? duplicates[0].id : null;
        console.log("DUPLICATES_CHECK_DONE:", { count: duplicates.length, duplicateOf });

        // 4. Refined Severity Scoring
        const kwWeight = getKeywordWeight(translatedText);
        const finalSeverity = calculateSeverity(
            aiAnalysis.severity,
            aiAnalysis.sentiment,
            kwWeight,
            duplicates.length
        );
        console.log("SEVERITY_CALCULATED:", finalSeverity);

        console.log("SAVING_TO_PRISMA...");
        // Generate Receipt ID
        const receiptId = `JSK-RCPT-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;

        const complaint = await prisma.complaint.create({
            data: {
                ticketId,
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
                duplicateOf: duplicateOf,
            } as any,
            include: {
                author: { select: { name: true, email: true } },
            }
        });
        console.log("PRISMA_SAVE_SUCCESS:", complaint.id);

        // 5. Real-time Notification for Officers/Admins
        try {
            console.log("TRIGGERING_PUSHER_ADMIN...");
            await pusherServer.trigger("governance-channel", "new-complaint", {
                id: complaint.id,
                ticketId: complaint.ticketId,
                category: complaint.category,
                severity: complaint.severity,
                location: { lat: latitude, lng: longitude },
                authorName: complaint.author?.name
            });
            console.log("PUSHER_ADMIN_SUCCESS");
        } catch (pusherError) {
            console.error("PUSHER_ADMIN_ERROR_CONTINUING:", pusherError);
        }

        // 6. Integrated Notification Service (Database + Email + Citizen Real-time)
        try {
            console.log("TRIGGERING_NOTIFICATION_SERVICE...");
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
            console.log("NOTIFICATION_SERVICE_SUCCESS");
        } catch (notifyError) {
            console.error("NOTIFICATION_SERVICE_ERROR_CONTINUING:", notifyError);
        }

        return NextResponse.json({ complaint });
    } catch (error) {
        console.error("COMPLAINT_SUBMIT_ERROR_DETAIL:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
