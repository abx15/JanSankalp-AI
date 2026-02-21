import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getTenantFilter } from "@/lib/rbac";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const tenantFilter = getTenantFilter(session.user as any);

        const complaints = await prisma.complaint.findMany({
            where: tenantFilter,
            include: {
                author: { select: { name: true } },
                department: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ complaints });
    } catch (error) {
        console.error("COMPLAINTS_GET_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, imageUrl, latitude, longitude, authorId } = body;

        if (!authorId) {
            return new NextResponse("Missing authorId", { status: 400 });
        }

        // Fetch Author's regional metadata
        const author = await prisma.user.findUnique({
            where: { id: authorId },
            select: {
                stateId: true,
                districtId: true,
                cityId: true,
                wardId: true,
            }
        });

        const ticketId = `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        // Save to Database with regional metadata
        const complaint = await prisma.complaint.create({
            data: {
                ticketId,
                title: title || "Civic Issue",
                description,
                originalText: description,
                status: "PENDING",
                category: "General",
                latitude,
                longitude,
                authorId,
                imageUrl,
                // Assign regional IDs from author
                stateId: author?.stateId,
                districtId: author?.districtId,
                cityId: author?.cityId,
                wardId: author?.wardId,
            } as any,
            include: {
                author: { select: { name: true, email: true } },
            }
        });

        // Emit Kafka Event for Backend Processing (including regional context)
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

        // Instant Real-time Notification
        try {
            const { pusherServer } = await import("@/lib/pusher");
            await pusherServer.trigger("governance-channel", "new-complaint", {
                id: complaint.id,
                ticketId: complaint.ticketId,
                status: complaint.status,
                location: { lat: latitude, lng: longitude },
                districtId: complaint.districtId
            });
        } catch (err) {
            console.error("[PUSH] Error:", err);
        }

        return NextResponse.json({
            message: "Complaint registered successfully and is being processed by AI.",
            ticketId: complaint.ticketId,
            status: "PENDING",
            region: author?.districtId || "Global"
        });

    } catch (error: any) {
        console.error("COMPLAINT_POST_ERROR", error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
