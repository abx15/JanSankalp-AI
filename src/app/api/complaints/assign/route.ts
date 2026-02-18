import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only admins can assign complaints
        if (session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { complaintId, officerId } = body;

        console.log("COMPLAINT_ASSIGNMENT_REQUEST", {
            complaintId,
            officerId,
            assignedBy: session.user.id
        });

        // Get officer details
        const officer = await prisma.user.findUnique({
            where: { id: officerId },
            select: { name: true, email: true, role: true }
        });

        if (!officer || officer.role !== "OFFICER") {
            return NextResponse.json({ error: "Invalid officer" }, { status: 400 });
        }

        // Update complaint with assignment
        const updatedComplaint = await prisma.complaint.update({
            where: { id: complaintId },
            data: {
                assignedToId: officerId,
                status: "IN_PROGRESS"
            },
            include: {
                author: { select: { name: true, email: true } },
                assignedTo: { select: { name: true, email: true } }
            }
        });

        console.log("COMPLAINT_ASSIGNMENT_SUCCESS", updatedComplaint);

        // 3. Integrated Notification (Officer Pusher + User Email & DB)
        try {
            // Real-time notification to officer
            await pusherServer.trigger("officer-channel", "complaint-assigned", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                title: updatedComplaint.title,
                assignedBy: session.user.name,
                timestamp: new Date().toISOString()
            });

            // Notify User via Email + DB + Pusher
            const { notifyComplaintAssigned } = await import("@/lib/notification-service");
            await notifyComplaintAssigned({
                userId: updatedComplaint.authorId,
                userEmail: updatedComplaint.author?.email || "",
                userName: updatedComplaint.author?.name || "Citizen",
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                officerName: officer.name || "Officer",
                complaintTitle: updatedComplaint.title
            });

            // Status Update for Admins
            await pusherServer.trigger("governance-channel", "complaint-updated", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                status: updatedComplaint.status,
                updatedBy: session.user.name,
                userRole: session.user.role,
                timestamp: new Date().toISOString()
            });

            console.log("NOTIFICATIONS_SENT_SUCCESSFULLY");
        } catch (notifyError) {
            console.error("NOTIFICATION_TRIGGER_ERROR:", notifyError);
        }

        return NextResponse.json({
            success: true,
            complaint: updatedComplaint,
            assignedOfficer: officer
        });

    } catch (error) {
        console.error("COMPLAINT_ASSIGNMENT_ERROR:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
