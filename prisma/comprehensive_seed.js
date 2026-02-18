const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive database seeding...');

    // Clean existing data (optional - uncomment if you want to start fresh)
    // await prisma.notification.deleteMany();
    // await prisma.complaint.deleteMany();
    // await prisma.department.deleteMany();
    // await prisma.user.deleteMany();

    // Helper function to hash password
    const hashPassword = async (password) => {
        return await bcrypt.hash(password, 12);
    };

    // 1. Create Departments
    const departments = [
        { name: 'Public Works Department (PWD)' },
        { name: 'Municipal Corporation' },
        { name: 'Water Supply Department' },
        { name: 'Electricity Department' },
        { name: 'Traffic Police' },
        { name: 'Health Department' },
    ];

    console.log('🏢 Creating departments...');
    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: {},
            create: dept,
        });
    }

    // 2. Create Users with proper password hashing
    const defaultPassword = 'password123'; // Default password for all seeded users
    
    console.log('👥 Creating users with hashed passwords...');
    
    // Admin users
    const adminUsers = [
        { email: 'admin@jansankalp.gov.in', name: 'Super Admin', role: 'ADMIN' },
        { email: 'deputy.admin@jansankalp.gov.in', name: 'Deputy Administrator', role: 'ADMIN' },
    ];

    // Officer users
    const officerUsers = [
        { email: 'lokesh.sharma@jansankalp.gov.in', name: 'Lokesh Sharma', role: 'OFFICER', department: 'Public Works Department (PWD)' },
        { email: 'priya.patel@jansankalp.gov.in', name: 'Priya Patel', role: 'OFFICER', department: 'Municipal Corporation' },
        { email: 'rahul.verma@jansankalp.gov.in', name: 'Rahul Verma', role: 'OFFICER', department: 'Water Supply Department' },
        { email: 'anita.desai@jansankalp.gov.in', name: 'Anita Desai', role: 'OFFICER', department: 'Electricity Department' },
        { email: 'rajesh.kumar@jansankalp.gov.in', name: 'Rajesh Kumar', role: 'OFFICER', department: 'Traffic Police' },
        { email: 'swati.reddy@jansankalp.gov.in', name: 'Swati Reddy', role: 'OFFICER', department: 'Health Department' },
        { email: 'amit.singh@jansankalp.gov.in', name: 'Amit Singh', role: 'OFFICER', department: 'Public Works Department (PWD)' },
        { email: 'neha.gupta@jansankalp.gov.in', name: 'Neha Gupta', role: 'OFFICER', department: 'Municipal Corporation' },
    ];

    // Citizen users
    const citizenUsers = [
        { email: 'arun.kumar@example.com', name: 'Arun Kumar', role: 'CITIZEN', points: 150 },
        { email: 'rahul.sharma@example.com', name: 'Rahul Sharma', role: 'CITIZEN', points: 120 },
        { email: 'priya.nair@example.com', name: 'Priya Nair', role: 'CITIZEN', points: 200 },
        { email: 'vijay.patel@example.com', name: 'Vijay Patel', role: 'CITIZEN', points: 80 },
        { email: 'kavita.reddy@example.com', name: 'Kavita Reddy', role: 'CITIZEN', points: 95 },
        { email: 'ramesh.kumar@example.com', name: 'Ramesh Kumar', role: 'CITIZEN', points: 110 },
        { email: 'sunita.devi@example.com', name: 'Sunita Devi', role: 'CITIZEN', points: 75 },
        { email: 'mohan.singh@example.com', name: 'Mohan Singh', role: 'CITIZEN', points: 130 },
        { email: 'geeta.rani@example.com', name: 'Geeta Rani', role: 'CITIZEN', points: 60 },
        { email: 'akash.verma@example.com', name: 'Akash Verma', role: 'CITIZEN', points: 140 },
        { email: 'pooja.sharma@example.com', name: 'Pooja Sharma', role: 'CITIZEN', points: 85 },
        { email: 'deepak.kumar@example.com', name: 'Deepak Kumar', role: 'CITIZEN', points: 100 },
        { email: 'anita.yadav@example.com', name: 'Anita Yadav', role: 'CITIZEN', points: 115 },
        { email: 'rohit.mehta@example.com', name: 'Rohit Mehta', role: 'CITIZEN', points: 70 },
        { email: 'laxmi.patel@example.com', name: 'Laxmi Patel', role: 'CITIZEN', points: 90 },
        { email: 'ramesh.gupta@example.com', name: 'Ramesh Gupta', role: 'CITIZEN', points: 125 },
        { email: 'seema.devi@example.com', name: 'Seema Devi', role: 'CITIZEN', points: 55 },
        { email: 'vivek.singh@example.com', name: 'Vivek Singh', role: 'CITIZEN', points: 105 },
        { email: 'radhika.sharma@example.com', name: 'Radhika Sharma', role: 'CITIZEN', points: 145 },
        { email: 'manoj.kumar@example.com', name: 'Manoj Kumar', role: 'CITIZEN', points: 65 },
        { email: 'tara.devi@example.com', name: 'Tara Devi', role: 'CITIZEN', points: 88 },
    ];

    const allUsers = [...adminUsers, ...officerUsers, ...citizenUsers];
    const createdUsers = [];

    // Create all users with hashed passwords
    for (const userData of allUsers) {
        const hashedPassword = await hashPassword(defaultPassword);
        
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {
                password: hashedPassword,
                emailVerified: new Date(),
            },
            create: {
                email: userData.email,
                name: userData.name,
                role: userData.role,
                password: hashedPassword,
                points: userData.points || 0,
                emailVerified: new Date(),
                phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                address: `${Math.floor(Math.random() * 100) + 1}, Main Street, ${['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)]}`,
                latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
                longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
            },
        });
        
        createdUsers.push(user);
        console.log(`✅ Created ${userData.role}: ${userData.name} (${userData.email})`);
    }

    // Assign officers to departments
    console.log('🏛️ Assigning officers to departments...');
    for (const officerData of officerUsers) {
        const department = await prisma.department.findUnique({
            where: { name: officerData.department }
        });
        
        if (department) {
            const officer = createdUsers.find(u => u.email === officerData.email);
            if (officer) {
                await prisma.department.update({
                    where: { id: department.id },
                    data: { headId: officer.id }
                });
                console.log(`🔗 Assigned ${officer.name} to ${department.name}`);
            }
        }
    }

    // 3. Create Sample Complaints
    console.log('📋 Creating sample complaints...');
    const complaintCategories = ['pothole', 'streetlight', 'garbage', 'water', 'electricity', 'traffic'];
    const complaintTitles = [
        'Large pothole on main road',
        'Broken streetlight causing safety issues',
        'Garbage overflow in residential area',
        'Water pipeline leakage',
        'Power outage in commercial area',
        'Traffic signal malfunction',
        'Damaged road shoulder',
        'Streetlight not working for weeks',
        'Improper waste disposal',
        'Low water pressure',
        'Hanging electric wires',
        'Poor road condition after rain',
    ];

    const complaintDescriptions = [
        'This issue has been persisting for over a week and needs immediate attention.',
        'Multiple complaints have been filed but no action taken yet.',
        'This is causing significant inconvenience to residents.',
        'Safety hazard for children and elderly people.',
        'Affecting daily commute and business activities.',
        'Urgent repair needed before accident occurs.',
    ];

    const citizens = createdUsers.filter(u => u.role === 'CITIZEN');
    const officers = createdUsers.filter(u => u.role === 'OFFICER');

    for (let i = 0; i < 25; i++) {
        const randomCitizen = citizens[Math.floor(Math.random() * citizens.length)];
        const randomOfficer = officers[Math.floor(Math.random() * officers.length)];
        const category = complaintCategories[Math.floor(Math.random() * complaintCategories.length)];
        const title = complaintTitles[Math.floor(Math.random() * complaintTitles.length)];
        const description = complaintDescriptions[Math.floor(Math.random() * complaintDescriptions.length)];
        
        const statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'RESUMED'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Get department for the officer
        const department = await prisma.department.findFirst({
            where: { headId: randomOfficer?.id }
        });
        
        const complaint = await prisma.complaint.create({
            data: {
                ticketId: `JSK-2026-${String(20000 + i).padStart(5, '0')}`,
                title: title,
                description: description,
                status: status,
                category: category,
                severity: Math.floor(Math.random() * 5) + 1,
                latitude: 28.6139 + (Math.random() - 0.5) * 0.2,
                longitude: 77.2090 + (Math.random() - 0.5) * 0.2,
                authorId: randomCitizen.id,
                assignedToId: Math.random() > 0.3 ? randomOfficer.id : null,
                departmentId: department?.id || null,
            },
        });

        // Create notifications for the complaint
        await prisma.notification.create({
            data: {
                userId: randomCitizen.id,
                type: 'COMPLAINT_REGISTERED',
                title: 'Complaint Registered',
                message: `Your complaint ${complaint.ticketId} has been registered successfully.`,
                complaintId: complaint.id,
            },
        });

        if (status === 'IN_PROGRESS' || status === 'RESOLVED') {
            await prisma.notification.create({
                data: {
                    userId: randomCitizen.id,
                    type: 'STATUS_UPDATE',
                    title: `Status: ${status}`,
                    message: `Your complaint ${complaint.ticketId} status has been updated to ${status}.`,
                    complaintId: complaint.id,
                },
            });
        }
    }

    // 4. Create some additional notifications
    console.log('🔔 Creating notifications...');
    for (const citizen of citizens.slice(0, 10)) {
        await prisma.notification.create({
            data: {
                userId: citizen.id,
                type: 'STATUS_UPDATE',
                title: 'System Update',
                message: 'New features have been added to the complaint portal.',
                read: Math.random() > 0.5,
            },
        });
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Total Users: ${allUsers.length}`);
    console.log(`  - Admins: ${adminUsers.length}`);
    console.log(`  - Officers: ${officerUsers.length}`);
    console.log(`  - Citizens: ${citizenUsers.length}`);
    console.log(`- Departments: ${departments.length}`);
    console.log(`- Sample Complaints: 25`);
    console.log(`- Default Password: ${defaultPassword}`);
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@jansankalp.gov.in');
    console.log('Officer: lokesh.sharma@jansankalp.gov.in');
    console.log('Citizen: arun.kumar@example.com');
    console.log(`Password for all accounts: ${defaultPassword}`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
