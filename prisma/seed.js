const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Create Users
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@jansankalp.gov.in' },
        update: {},
        create: {
            email: 'admin@jansankalp.gov.in',
            name: 'Super Admin',
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });

    const officer = await prisma.user.upsert({
        where: { email: 'officer@jansankalp.gov.in' },
        update: {},
        create: {
            email: 'officer@jansankalp.gov.in',
            name: 'Lokesh Sharma',
            role: 'OFFICER',
            emailVerified: new Date(),
        },
    });

    const citizen = await prisma.user.upsert({
        where: { email: 'citizen@example.com' },
        update: {},
        create: {
            email: 'citizen@example.com',
            name: 'Arun Kumar',
            role: 'CITIZEN',
            points: 120,
            emailVerified: new Date(),
        },
    });

    // 2. Create Departments
    const pwd = await prisma.department.upsert({
        where: { name: 'PWD' },
        update: {},
        create: {
            name: 'PWD',
            description: 'Public Works Department',
        },
    });

    const municipal = await prisma.department.upsert({
        where: { name: 'Municipal' },
        update: {},
        create: {
            name: 'Municipal',
            description: 'Municipal Corporation',
        },
    });

    // 3. Create Complaints
    const complaint1 = await prisma.complaint.create({
        data: {
            ticketId: 'JSK-2026-12345',
            title: 'Pothole on Main Street',
            description: 'Large pothole causing traffic issues near the metro station.',
            status: 'PENDING',
            category: 'pothole',
            latitude: 28.6139,
            longitude: 77.2090,
            region: 'New Delhi',
            severity: 4,
            authorId: citizen.id,
        },
    });

    const complaint2 = await prisma.complaint.create({
        data: {
            ticketId: 'JSK-2026-67890',
            title: 'Broken Streetlight',
            description: 'Streetlight is off for 3 days in Block B.',
            status: 'IN_PROGRESS',
            category: 'streetlight',
            latitude: 28.6200,
            longitude: 77.2100,
            region: 'Karol Bagh',
            severity: 2,
            authorId: citizen.id,
        },
    });

    const complaint3 = await prisma.complaint.create({
        data: {
            ticketId: 'JSK-2026-11223',
            title: 'Garbage Overflow',
            description: 'Waste management failed to pick up trash today.',
            status: 'RESOLVED',
            category: 'garbage',
            latitude: 28.6300,
            longitude: 77.2200,
            region: 'Connaught Place',
            severity: 3,
            authorId: citizen.id,
        },
    });

    // 4. Create Notifications
    await prisma.notification.create({
        data: {
            userId: citizen.id,
            type: 'COMPLAINT_REGISTERED',
            title: 'Report Received',
            message: 'Your pothole report JSK-2026-12345 has been logged.',
            complaintId: complaint1.id,
        },
    });

    await prisma.notification.create({
        data: {
            userId: citizen.id,
            type: 'STATUS_UPDATE',
            title: 'Status: In Progress',
            message: 'Repair work started on streetlight JSK-2026-67890.',
            complaintId: complaint2.id,
        },
    });

    await prisma.notification.create({
        data: {
            userId: citizen.id,
            type: 'RESOLVED',
            title: 'Issue Resolved',
            message: 'Garbage reported in JSK-2026-11223 has been cleared.',
            complaintId: complaint3.id,
            read: true,
        },
    });

    console.log('Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
