import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, token } = await req.json();

        if (!email || !token) {
            return NextResponse.json(
                { error: "Email and token are required" },
                { status: 400 }
            );
        }

        const verificationToken = await (prisma as any).verificationToken.findFirst({
            where: {
                email,
                token,
            },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: "Invalid verification code" },
                { status: 400 }
            );
        }

        const hasExpired = new Date(verificationToken.expires) < new Date();

        if (hasExpired) {
            return NextResponse.json(
                { error: "Verification code has expired" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
            } as any,
        });

        await (prisma as any).verificationToken.delete({
            where: { id: verificationToken.id },
        });

        return NextResponse.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            { error: "An error occurred during verification" },
            { status: 500 }
        );
    }
}
