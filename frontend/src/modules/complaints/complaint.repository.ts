import prisma from "@/data/prisma";

export class ComplaintRepository {
    async findAll(where: any) {
        return prisma.complaint.findMany({
            where,
            include: {
                author: { select: { name: true } },
                department: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async findById(id: string) {
        return prisma.complaint.findUnique({
            where: { id },
            include: {
                author: { select: { name: true, email: true } },
                department: { select: { name: true } },
            }
        });
    }

    async findOfficerById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: { name: true, email: true, role: true }
        });
    }

    async create(data: any) {
        return prisma.complaint.create({
            data,
            include: {
                author: { select: { name: true, email: true } },
            }
        });
    }

    async update(id: string, data: any) {
        return prisma.complaint.update({
            where: { id },
            data,
        });
    }
}

export const complaintRepository = new ComplaintRepository();
