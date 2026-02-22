import prisma from "@/data/prisma";
import { User } from "@prisma/client";

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async createUser(data: any) {
        return prisma.user.create({
            data,
        });
    }

    async updateUser(id: string, data: any) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async findResetToken(email: string, token: string) {
        return (prisma as any).passwordResetToken.findFirst({
            where: { email, token },
        });
    }

    async createResetToken(data: any) {
        return (prisma as any).passwordResetToken.create({
            data,
        });
    }

    async deleteResetToken(id: string) {
        return (prisma as any).passwordResetToken.delete({
            where: { id },
        });
    }

    async findVerificationToken(email: string, token: string) {
        return (prisma as any).verificationToken.findFirst({
            where: { email, token },
        });
    }

    async deleteVerificationToken(id: string) {
        return (prisma as any).verificationToken.delete({
            where: { id },
        });
    }
}

export const authRepository = new AuthRepository();
