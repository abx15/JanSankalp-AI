import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@jansankalp.ai";
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: "ADMIN",
            emailVerified: new Date(),
        } as any,
        create: {
            email: adminEmail,
            name: "System Admin",
            password: hashedPassword,
            role: "ADMIN",
            emailVerified: new Date(),
        } as any,
    });

    console.log("Admin user seeded:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
