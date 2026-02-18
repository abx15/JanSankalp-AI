import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function PUT(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { complaintId, status, officerNote, verificationImageUrl } = body;

        console.log("COMPLAINT_UPDATE_REQUEST", {
            complaintId,
            status,
            officerNote,
            verificationImageUrl,
            updatedBy: session.user.role,
            userId: session.user.id
        });

        // Only officers and admins can update complaints
        if (session.user.role !== "OFFICER" && session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update the complaint
        const updatedComplaint = await prisma.complaint.update({
            where: { id: complaintId },
            data: {
                status,
                assignedToId: session.user.id, // Assign to the officer updating it
                remarks: officerNote ? {
                    create: {
                        text: officerNote,
                        authorName: session.user.name || "",
                        authorRole: session.user.role as "OFFICER" | "ADMIN",
                        imageUrl: verificationImageUrl || ""
                    }
                } : undefined
            },
            include: {
                author: { select: { name: true, email: true } },
                assignedTo: { select: { name: true } },
                remarks: true
            }
        });

        console.log("COMPLAINT_UPDATE_SUCCESS", updatedComplaint);

        // Send real-time notification to admin dashboard
        try {
            await pusherServer.trigger("governance-channel", "complaint-updated", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                status: updatedComplaint.status,
                updatedBy: session.user.name,
                userRole: session.user.role,
                officerNote,
                verificationImageUrl,
                timestamp: new Date().toISOString()
            });
            console.log("ADMIN_NOTIFICATION_SENT");
        } catch (pusherError) {
            console.error("ADMIN_NOTIFICATION_ERROR:", pusherError);
        }

        // 3. Notify Citizen (Real-time + Email + DB Record)
        if (updatedComplaint.author) {
            const { notifyStatusUpdate } = await import("@/lib/notification-service");
            await notifyStatusUpdate({
                userId: updatedComplaint.authorId,
                userEmail: updatedComplaint.author.email || "",
                userName: updatedComplaint.author.name || "Citizen",
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                newStatus: status,
                complaintTitle: updatedComplaint.title
            });
            console.log("NOTIFICATIONS_SENT_TO_USER");
        }

        return NextResponse.json({
            success: true,
            complaint: updatedComplaint
        });

    } catch (error) {
        console.error("COMPLAINT_UPDATE_ERROR:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
