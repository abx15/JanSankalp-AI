const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
    console.log("Starting standalone seed...");

    // 1. Create Departments
    const departments = [
        { name: "Waste Management" },
        { name: "Roads & Infrastructure" },
        { name: "Water Supply" },
    ];

    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept,
        });
    }
    console.log("Departments seeded.");

    // 2. Create Users
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const admin = await prisma.user.upsert({
        where: { email: "admin@jansankalp.gov.in" },
        update: { role: "ADMIN", password: hashedPassword },
        create: {
            email: "admin@jansankalp.gov.in",
            name: "System Admin",
            role: "ADMIN",
            password: hashedPassword,
        },
    });

    const citizen = await prisma.user.upsert({
        where: { email: "citizen@example.com" },
        update: { role: "CITIZEN", password: hashedPassword },
        create: {
            email: "citizen@example.com",
            name: "Rahul Sharma",
            role: "CITIZEN",
            password: hashedPassword,
        },
    });
    console.log("Users seeded.");

    // 3. Create Sample Complaints
    const wasteDept = await prisma.department.findUnique({ where: { name: "Waste Management" } });

    const complaint = await prisma.complaint.upsert({
        where: { ticketId: "JSK-2026-TEST-01" },
        update: {},
        create: {
            ticketId: "JSK-2026-TEST-01",
            title: "Waste Management reported",
            description: "Sample complaint for testing dashboard visibility.",
            category: "Garbage",
            severity: 3,
            latitude: 12.9716,
            longitude: 77.5946,
            authorId: citizen.id,
            departmentId: wasteDept?.id,
        },
    });
    console.log("Sample complaint seeded:", complaint.ticketId);
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
