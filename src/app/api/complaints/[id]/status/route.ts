import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { notifyStatusUpdate } from "@/lib/notification-service";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "OFFICER")) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { status } = body;

        if (!status) {
            return new NextResponse("Missing status", { status: 400 });
        }

        // 1. Update Complaint Status
        const complaint = await prisma.complaint.update({
            where: { id: params.id },
            data: { status },
            include: {
                author: { select: { id: true, name: true, email: true } }
            }
        });

        // 2. Trigger Admin/Officer Dashboard Refresh
        try {
            await pusherServer.trigger("governance-channel", "complaint-updated", {
                id: complaint.id,
                status: complaint.status,
                ticketId: complaint.ticketId
            });
        } catch (pusherError) {
            console.error("PUSHER_ADMIN_ERROR:", pusherError);
        }

        // 3. Notify Citizen (Real-time + Email + DB Record)
        if (complaint.author) {
            await notifyStatusUpdate({
                userId: complaint.author.id,
                userEmail: complaint.author.email || "",
                userName: complaint.author.name || "Citizen",
                complaintId: complaint.id,
                ticketId: complaint.ticketId,
                newStatus: status,
                complaintTitle: complaint.title
            });
        }

        return NextResponse.json({ complaint });
    } catch (error) {
        console.error("STATUS_UPDATE_ERROR:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
