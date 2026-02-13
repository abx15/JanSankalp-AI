import prisma from "./prisma";

async function main() {
    console.log("Seeding database...");

    // Seed Departments
    const departments = [
        { name: "Waste Management" },
        { name: "Roads & Infrastructure" },
        { name: "Water Supply" },
        { name: "Electricity & Lighting" },
        { name: "Public Health" },
        { name: "Drainage & Sewage" }
    ];

    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept,
        });
    }

    // Seed Users
    const admin = await prisma.user.upsert({
        where: { email: "admin@jansankalp.ai" },
        update: {},
        create: {
            email: "admin@jansankalp.ai",
            name: "System Admin",
            role: "ADMIN",
        },
    });

    const officer = await prisma.user.upsert({
        where: { email: "officer@jansankalp.ai" },
        update: {},
        create: {
            email: "officer@jansankalp.ai",
            name: "Municipal Officer",
            role: "OFFICER",
        },
    });

    const citizen = await prisma.user.upsert({
        where: { email: "citizen@example.com" },
        update: {},
        create: {
            email: "citizen@example.com",
            name: "Rahul Sharma",
            role: "CITIZEN",
        },
    });

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
