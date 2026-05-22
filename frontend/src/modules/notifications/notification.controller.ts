import { NextResponse } from "next/server";
import { notificationService } from "./notification.service";
import { handleError, AppError } from "@/core/error-handler";
import { auth } from "@/auth";

export class NotificationController {
    async getAll(req: Request) {
        try {
            const session = await auth();
            if (!session?.user?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const notifications = await notificationService.getNotificationsForUser(session.user.id);
            return NextResponse.json({ notifications });
        } catch (error) {
            return handleError(error);
        }
    }

    async markRead(req: Request) {
        try {
            const session = await auth();
            if (!session?.user?.id) {
                throw new AppError("Unauthorized", 401);
            }

            const body = await req.json();
            const { notificationId, all } = body;

            await notificationService.markRead(session.user.id, all ? undefined : notificationId);
            return NextResponse.json({ success: true });
        } catch (error) {
            return handleError(error);
        }
    }
}

export const notificationController = new NotificationController();
