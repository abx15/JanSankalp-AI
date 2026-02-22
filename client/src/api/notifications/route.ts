import { notificationController } from "@/modules/notifications/notification.controller";

export async function GET(req: Request) {
    return notificationController.getAll(req);
}

export async function PATCH(req: Request) {
    return notificationController.markRead(req);
}
