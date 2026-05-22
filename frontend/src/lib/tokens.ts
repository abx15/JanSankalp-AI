import prisma from "@/lib/prisma";
import crypto from "crypto";

export const generateVerificationToken = async (email: string) => {
    // Generate a random 6-digit OTP
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

    const existingToken = await prisma.verificationToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
    // Generate a random 6-digit OTP
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 600 * 1000); // 10 minutes from now

    const existingToken = await (prisma as any).passwordResetToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await (prisma as any).passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    }

    const passwordResetToken = await (prisma as any).passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
};
