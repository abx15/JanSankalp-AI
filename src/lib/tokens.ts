import prisma from "@/lib/prisma";
import crypto from "crypto";

export const generateVerificationToken = async (email: string) => {
    // Generate a random 6-digit OTP
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

    const existingToken = await (prisma as any).verificationToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await (prisma as any).verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    const verificationToken = await (prisma as any).verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};
