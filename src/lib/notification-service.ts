import prisma from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { sendStatusUpdateEmail, sendComplaintConfirmationEmail, sendComplaintAssignedEmail } from "@/lib/email-service";

export type NotificationType = "COMPLAINT_REGISTERED" | "STATUS_UPDATE" | "RESOLVED";

export async function createNotification({
    userId,
    type,
    title,
    message,
    complaintId
}: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    complaintId?: string;
}) {
    try {
        // 1. Create notification in database
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                complaintId
            }
        });

        // 2. Trigger real-time notification via Pusher
        await pusherServer.trigger(`user-${userId}`, "notification", {
            id: notification.id,
            type,
            title,
            message,
            complaintId,
            createdAt: notification.createdAt
        });

        return notification;
    } catch (error) {
        console.error("NOTIFICATION_SERVICE_ERROR:", error);
        return null;
    }
}

export async function notifyStatusUpdate({
    userId,
    userEmail,
    userName,
    complaintId,
    ticketId,
    newStatus,
    complaintTitle
}: {
    userId: string;
    userEmail: string;
    userName: string;
    complaintId: string;
    ticketId: string;
    newStatus: string;
    complaintTitle: string;
}) {
    const title = `Status Updated: ${newStatus}`;
    const message = `Your complaint ${ticketId} status has been updated to ${newStatus}.`;

    // 1. Send Dashboard Notification
    await createNotification({
        userId,
        type: newStatus === "RESOLVED" ? "RESOLVED" : "STATUS_UPDATE",
        title,
        message,
        complaintId
    });

    // 2. Send Email Notification
    if (userEmail) {
        await sendStatusUpdateEmail(userEmail, userName, ticketId, newStatus, complaintTitle);
    }
}

export async function notifyComplaintRegistered({
    userId,
    userEmail,
    userName,
    complaintId,
    ticketId,
    category,
    location
}: {
    userId: string;
    userEmail: string;
    userName: string;
    complaintId: string;
    ticketId: string;
    category: string;
    location: string;
}) {
    const title = "Complaint Registered";
    const message = `Your complaint ${ticketId} has been successfully registered.`;

    // 1. Send Dashboard Notification
    await createNotification({
        userId,
        type: "COMPLAINT_REGISTERED",
        title,
        message,
        complaintId
    });

    if (userEmail) {
        await sendComplaintConfirmationEmail(userEmail, userName, ticketId, category, location);
    }
}

export async function notifyComplaintAssigned({
    userId,
    userEmail,
    userName,
    complaintId,
    ticketId,
    officerName,
    complaintTitle
}: {
    userId: string;
    userEmail: string;
    userName: string;
    complaintId: string;
    ticketId: string;
    officerName: string;
    complaintTitle: string;
}) {
    const title = "Officer Assigned";
    const message = `An officer (${officerName}) has been assigned to your complaint ${ticketId}.`;

    // 1. Send Dashboard Notification
    await createNotification({
        userId,
        type: "STATUS_UPDATE",
        title,
        message,
        complaintId
    });

    // 2. Send Email Notification
    if (userEmail) {
        await sendComplaintAssignedEmail(userEmail, userName, ticketId, officerName, complaintTitle);
    }
}

/**
 * AI-Driven Resolution Notification
 */
export async function notifyResolutionWithAI({
    userId,
    userEmail,
    userName,
    complaintId,
    ticketId,
    resolutionDetails,
    complaintTitle
}: {
    userId: string;
    userEmail: string;
    userName: string;
    complaintId: string;
    ticketId: string;
    resolutionDetails: string;
    complaintTitle: string;
}) {
    // We can use AI to summarize the resolution for the notification message
    const title = "Issue Resolved! 🏆";
    const message = `Excellent news! Your complaint ${ticketId} has been professionally resolved. Summary: ${resolutionDetails.slice(0, 100)}...`;

    // 1. Send Dashboard Notification
    await createNotification({
        userId,
        type: "RESOLVED",
        title,
        message,
        complaintId
    });

    // 2. Send Email Notification
    if (userEmail) {
        await sendStatusUpdateEmail(userEmail, userName, ticketId, "RESOLVED", complaintTitle);
    }
}
