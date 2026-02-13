import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || !session.user || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { status } = await req.json();

        // Fetch complaint with author to notify them
        const complaint = await prisma.complaint.findUnique({
            where: { id: params.id },
            include: { author: true },
        });

        if (!complaint) {
            return new NextResponse("Complaint not found", { status: 404 });
        }

        // Automated Department Assignment (if category matches)
        let departmentId = complaint.departmentId;
        if (!departmentId) {
            const dept = await prisma.department.findUnique({
                where: { name: complaint.category }
            });
            if (dept) {
                departmentId = dept.id;
            }
        }

        // Update status and department
        const updatedComplaint = await prisma.complaint.update({
            where: { id: params.id },
            data: {
                status,
                departmentId,
                emailVerified: new Date(),
            }
        } as any,
            create: {
                email: citizenEmail,
                name: "Vikas Citizen",
                password: hashedPassword,
                role: "CITIZEN",
                emailVerified: new Date(),
            } as any);

        // Real-time notification to the user who filed the complaint
        if (complaint.authorId) {
            await pusherServer.trigger(`user-${complaint.authorId}`, "notification", {
                title: "Complaint Update",
                message: `Your complaint "${complaint.title}" has been updated to ${status}.`,
                type: "update",
                status
            });
        }

        return NextResponse.json(updatedComplaint);
    } catch (error) {
        console.error("[COMPLAINT_VERIFY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
