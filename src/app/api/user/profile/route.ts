import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                email: true,
                phone: true,
                address: true,
                bio: true,
                latitude: true,
                longitude: true,
                avatarUrl: true,
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_PROFILE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, phone, address, bio, latitude, longitude, avatarUrl } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phone,
                address,
                bio,
                latitude,
                longitude,
                avatarUrl,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[USER_PROFILE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
