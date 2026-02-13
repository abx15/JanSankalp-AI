import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const citizenEmail = "citizen@example.com";
    const hashedPassword = await bcrypt.hash("User@123", 10);

    const citizen = await prisma.user.upsert({
        where: { email: citizenEmail },
        update: {
            password: hashedPassword,
            role: "CITIZEN",
            emailVerified: new Date(),
        } as any,
        create: {
            email: citizenEmail,
            name: "Rahul Citizen",
            password: hashedPassword,
            role: "CITIZEN",
            emailVerified: new Date(),
        } as any,
    });

    console.log("Citizen user seeded:", citizen.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
