import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "CITIZEN",
            },
        });

        // Trigger real-time update for admins
        await pusherServer.trigger("governance-channel", "user-registered", {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        }).catch(err => console.error("Pusher trigger error:", err));

        // Generate OTP and send email
        const { token } = await generateVerificationToken(email);
        await sendVerificationEmail(email, token);

        return NextResponse.json({
            success: true,
            message: "Verification email sent",
            email: user.email
        });
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "An error occurred during signup" },
            { status: 500 }
        );
    }
}
