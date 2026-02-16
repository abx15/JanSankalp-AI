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

    // Seed Sample Complaints
    const wasteDept = await prisma.department.findUnique({ where: { name: "Waste Management" } });
    const roadDept = await prisma.department.findUnique({ where: { name: "Roads & Infrastructure" } });

    const sampleComplaints = [
        {
            ticketId: `JSK-2026-10001`,
            title: "Garbage Pile near Main Market",
            description: "Huge pile of garbage accumulated near the market area for over a week.",
            category: "Garbage",
            severity: 4,
            latitude: 12.9716,
            longitude: 77.5946,
            status: "PENDING" as any,
            authorId: citizen.id,
            departmentId: wasteDept?.id,
        },
        {
            ticketId: `JSK-2026-10002`,
            title: "Pothole on MG Road",
            description: "Deep pothole causing traffic issues near the metro station.",
            category: "Road damage",
            severity: 5,
            latitude: 12.9756,
            longitude: 77.5926,
            status: "IN_PROGRESS" as any,
            authorId: citizen.id,
            departmentId: roadDept?.id,
        }
    ];

    for (const complaint of sampleComplaints) {
        await prisma.complaint.upsert({
            where: { ticketId: complaint.ticketId },
            update: {},
            create: complaint,
        });
    }

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
