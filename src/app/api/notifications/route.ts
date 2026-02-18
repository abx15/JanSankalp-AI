import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
                complaint: {
                    select: {
                        ticketId: true,
                        title: true
                    }
                }
            },
            take: 50
        });

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error("NOTIFICATIONS_GET_ERROR:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { notificationId, all } = body;

        if (all) {
            await prisma.notification.updateMany({
                where: { userId: session.user.id },
                data: { read: true }
            });
        } else if (notificationId) {
            await prisma.notification.update({
                where: { id: notificationId, userId: session.user.id },
                data: { read: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("NOTIFICATIONS_PATCH_ERROR:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
