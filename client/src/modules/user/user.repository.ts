import prisma from "@/data/prisma";

export class UserRepository {
    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                bio: true,
                latitude: true,
                longitude: true,
                avatarUrl: true,
                stateId: true,
                districtId: true,
                cityId: true,
                wardId: true,
            }
        });
    }

    async update(id: string, data: any) {
        return prisma.user.update({
            where: { id },
            data
        });
    }

    async getAllUsers(filter: any = {}) {
        return prisma.user.findMany({
            where: filter,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                emailVerified: true,
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async delete(id: string) {
        return prisma.user.delete({
            where: { id }
        });
    }
}

export const userRepository = new UserRepository();
