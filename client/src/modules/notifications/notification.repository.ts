import prisma from "@/data/prisma";

export class NotificationRepository {
    async findAllForUser(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                complaint: {
                    select: {
                        ticketId: true,
                        title: true,
                    },
                },
            },
            take: 50,
        });
    }

    async markAllRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId },
            data: { read: true },
        });
    }

    async markOneRead(notificationId: string, userId: string) {
        return prisma.notification.update({
            where: { id: notificationId, userId },
            data: { read: true },
        });
    }
}

export const notificationRepository = new NotificationRepository();
