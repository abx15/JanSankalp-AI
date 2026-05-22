import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
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

        if (user.emailVerified) {
            return NextResponse.json(
                { error: "Email is already verified" },
                { status: 400 }
            );
        }

        // Generate new OTP
        const { token } = await generateVerificationToken(email);

        // Send email
        const emailResult = await sendVerificationEmail(email, token);

        if (!emailResult.success) {
            console.error("❌ Failed to resend verification email:", emailResult.error);
            return NextResponse.json({
                success: false,
                error: "Failed to send verification email",
                debug: process.env.NODE_ENV === 'development' ? { token } : undefined
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Verification email sent successfully",
            debug: process.env.NODE_ENV === 'development' ? { token } : undefined
        });

    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
