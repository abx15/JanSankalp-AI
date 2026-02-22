import { complaintRepository } from "./complaint.repository";
import { CreateComplaintRequest } from "./complaint.schema";
import prisma from "@/lib/prisma";
import { AppError } from "@/core/error-handler";

export class ComplaintService {
    async getAllComplaints(filter: any) {
        return complaintRepository.findAll(filter);
    }

    async createComplaint(data: CreateComplaintRequest) {
        // Fetch Author's regional metadata
        const author = await prisma.user.findUnique({
            where: { id: data.authorId },
            select: {
                stateId: true,
                districtId: true,
                cityId: true,
                wardId: true,
            }
        });

        const ticketId = `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        const complaint = await complaintRepository.create({
            ticketId,
            title: data.title || "Civic Issue",
            description: data.description,
            originalText: data.description,
            status: "PENDING",
            category: "General",
            latitude: data.latitude,
            longitude: data.longitude,
            authorId: data.authorId,
            imageUrl: data.imageUrl,
            stateId: author?.stateId,
            districtId: author?.districtId,
            cityId: author?.cityId,
            wardId: author?.wardId,
        });

        // Kafka Event
        try {
            const { emitEvent } = await import("@/lib/kafka");
            await emitEvent("complaint_submitted", {
                complaint_id: complaint.id,
                ticketId: complaint.ticketId,
                description: complaint.description,
                latitude: complaint.latitude,
                longitude: complaint.longitude,
                authorId: complaint.authorId,
                stateId: complaint.stateId,
                districtId: complaint.districtId,
                cityId: complaint.cityId,
                wardId: complaint.wardId,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error("[KAFKA] Error:", err);
        }

        // Real-time Notification
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger("governance-channel", "new-complaint", {
                id: complaint.id,
                ticketId: complaint.ticketId,
                status: complaint.status,
                location: { lat: data.latitude, lng: data.longitude },
                districtId: complaint.districtId
            });
        } catch (err) {
            console.error("[PUSH] Error:", err);
        }

        return complaint;
    }

    async assignComplaint(complaintId: string, officerId: string, assignedByName: string) {
        const officer = await complaintRepository.findOfficerById(officerId);
        if (!officer || officer.role !== "OFFICER") {
            throw new AppError("Invalid officer", 400);
        }

        const updatedComplaint = await complaintRepository.update(complaintId, {
            assignedToId: officerId,
            status: "IN_PROGRESS"
        });

        // Notifications
        try {
            const { pusherServer } = await import("@/lib/pusher");

            // Real-time to officer
            await pusherServer.trigger("officer-channel", "complaint-assigned", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                title: updatedComplaint.title,
                assignedBy: assignedByName,
                timestamp: new Date().toISOString()
            });

            // Notify User
            const { notifyComplaintAssigned } = await import("@/lib/notification-service");
            await notifyComplaintAssigned({
                userId: updatedComplaint.authorId,
                userEmail: (updatedComplaint as any).author?.email || "",
                userName: (updatedComplaint as any).author?.name || "Citizen",
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                officerName: officer.name || "Officer",
                complaintTitle: updatedComplaint.title
            });

            // Governance Status Update
            await pusherServer.trigger("governance-channel", "complaint-updated", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                status: updatedComplaint.status,
                updatedBy: assignedByName,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error("NOTIFY_ERROR:", err);
        }

        return { complaint: updatedComplaint, officer };
    }

    async updateComplaint(complaintId: string, data: any, sessionUser: any) {
        const { status, officerNote, verificationImageUrl } = data;

        // Fetch original complaint for AI context
        const originalComplaint = await complaintRepository.findById(complaintId);
        if (!originalComplaint) {
            throw new AppError("Complaint not found", 404);
        }

        let aiVerification = null;
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://ai-engine:8000";

        if (status === "RESOLVED") {
            try {
                const verifyResp = await fetch(`${AI_SERVICE_URL}/verify-resolution`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        complaint_text: originalComplaint.description,
                        resolution_text: officerNote,
                        evidence_image_url: verificationImageUrl
                    }),
                });

                if (verifyResp.ok) {
                    aiVerification = await verifyResp.json();
                }
            } catch (err) {
                console.error("[AI-VERIFICATION] Failed:", err);
            }
        }

        // Update the complaint
        const updatedComplaint = await complaintRepository.update(complaintId, {
            status: (aiVerification && !aiVerification.verified) ? "IN_PROGRESS" : status,
            assignedToId: sessionUser.id,
            remarks: officerNote ? {
                create: {
                    text: aiVerification?.ai_summary || officerNote,
                    authorName: sessionUser.name || "",
                    authorRole: sessionUser.role as "OFFICER" | "ADMIN",
                    imageUrl: verificationImageUrl || ""
                }
            } : undefined,
            aiVerification: aiVerification ? {
                verified: aiVerification.verified,
                score: aiVerification.confidence_score,
                reasoning: aiVerification.reasoning,
                summary: aiVerification.ai_summary
            } : undefined
        });

        // Real-time notification to admin
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger("governance-channel", "complaint-updated", {
                complaintId: updatedComplaint.id,
                ticketId: updatedComplaint.ticketId,
                status: updatedComplaint.status,
                updatedBy: sessionUser.name,
                userRole: sessionUser.role,
                officerNote,
                verificationImageUrl,
                timestamp: new Date().toISOString()
            });

            // Notify Citizen
            if ((updatedComplaint as any).author) {
                const { notifyStatusUpdate } = await import("@/lib/notification-service");
                await notifyStatusUpdate({
                    userId: updatedComplaint.authorId,
                    userEmail: (updatedComplaint as any).author.email || "",
                    userName: (updatedComplaint as any).author.name || "Citizen",
                    complaintId: updatedComplaint.id,
                    ticketId: updatedComplaint.ticketId,
                    newStatus: status,
                    complaintTitle: updatedComplaint.title
                });
            }
        } catch (err) {
            console.error("NOTIFY_ERROR:", err);
        }

        return updatedComplaint;
    }

    async updateComplaintSimple(complaintId: string, status: string, sessionUser: any) {
        const updatedComplaint = await complaintRepository.update(complaintId, { status });

        // Notifications
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger("governance-channel", "complaint-updated", {
                id: updatedComplaint.id,
                status: updatedComplaint.status,
                ticketId: updatedComplaint.ticketId
            });

            // Notify Citizen
            const originalComplaint = await complaintRepository.findById(complaintId);
            if (originalComplaint && (originalComplaint as any).author) {
                const { notifyStatusUpdate } = await import("@/lib/notification-service");
                await notifyStatusUpdate({
                    userId: originalComplaint.authorId,
                    userEmail: (originalComplaint as any).author.email || "",
                    userName: (originalComplaint as any).author.name || "Citizen",
                    complaintId: updatedComplaint.id,
                    ticketId: updatedComplaint.ticketId,
                    newStatus: status,
                    complaintTitle: updatedComplaint.title
                });
            }
        } catch (err) {
            console.error("NOTIFY_ERROR:", err);
        }

        return updatedComplaint;
    }

    async verifyComplaint(complaintId: string, status: string, sessionUser: any) {
        const complaint = await complaintRepository.findById(complaintId);
        if (!complaint) {
            throw new AppError("Complaint not found", 404);
        }

        // Automated Department Assignment
        let departmentId = (complaint as any).departmentId;
        if (!departmentId) {
            const dept = await prisma.department.findUnique({
                where: { name: (complaint as any).category }
            });
            if (dept) {
                departmentId = dept.id;
            }
        }

        const updatedComplaint = await complaintRepository.update(complaintId, {
            status,
            departmentId
        });

        // Real-time notification to the user
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger(`user-${updatedComplaint.authorId}`, "notification", {
                title: "Complaint Update",
                message: `Your complaint "${updatedComplaint.title}" has been updated to ${status}.`,
                type: "update",
                status
            });

            // Email Notification
            if ((updatedComplaint as any).author?.email) {
                const { sendStatusUpdateEmail } = await import("@/lib/email-service");
                await sendStatusUpdateEmail(
                    (updatedComplaint as any).author.email,
                    (updatedComplaint as any).author.name || "Citizen",
                    updatedComplaint.ticketId,
                    status,
                    updatedComplaint.title
                );
            }
        } catch (err) {
            console.error("NOTIFY_ERROR:", err);
        }

        return updatedComplaint;
    }
}

export const complaintService = new ComplaintService();
