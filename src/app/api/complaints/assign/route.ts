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

        // Send notification to assigned officer
        try {
            await prisma.notification.create({
                data: {
                    userId: officerId,
                    type: "COMPLAINT_ASSIGNED",
                    title: "New Complaint Assigned",
                    message: `You have been assigned complaint ${updatedComplaint.ticketId}: ${updatedComplaint.title}`,
                    complaintId: updatedComplaint.id
                }
            });

            // Real-time notification to officer
            await pusherServer.trigger("officer-channel", "complaint-assigned", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                title: updatedComplaint.title,
                assignedBy: session.user.name,
                timestamp: new Date().toISOString()
            });

            console.log("OFFICER_NOTIFICATION_SENT");
        } catch (notifyError) {
            console.error("OFFICER_NOTIFICATION_ERROR:", notifyError);
        }

        // Send notification to complaint author
        try {
            await prisma.notification.create({
                data: {
                    userId: updatedComplaint.authorId,
                    type: "STATUS_UPDATE",
                    title: "Complaint Assigned",
                    message: `Your complaint ${updatedComplaint.ticketId} has been assigned to ${officer.name}`,
                    complaintId: updatedComplaint.id
                }
            });
            console.log("AUTHOR_NOTIFICATION_SENT");
        } catch (authorNotifyError) {
            console.error("AUTHOR_NOTIFICATION_ERROR:", authorNotifyError);
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
