import { notificationRepository } from "./notification.repository";

export class NotificationService {
    async getNotificationsForUser(userId: string) {
        return notificationRepository.findAllForUser(userId);
    }

    async markRead(userId: string, notificationId?: string) {
        if (notificationId) {
            return notificationRepository.markOneRead(notificationId, userId);
        }
        return notificationRepository.markAllRead(userId);
    }
}

export const notificationService = new NotificationService();
