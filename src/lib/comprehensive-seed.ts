import prisma from "./prisma";
import bcrypt from "bcryptjs";

async function main() {
    console.log("🌱 Starting comprehensive database seeding...");

    // Clear existing data (optional - comment out if you want to preserve data)
    console.log("🗑️  Cleaning existing data...");
    await prisma.remark.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();

    // Seed Departments
    console.log("📁 Creating departments...");
    const departments = [
        { name: "Waste Management" },
        { name: "Roads & Infrastructure" },
        { name: "Water Supply" },
        { name: "Electricity & Lighting" },
        { name: "Public Health" },
        { name: "Drainage & Sewage" },
        { name: "Parks & Recreation" },
        { name: "Traffic Control" }
    ];

    const createdDepts = [];
    for (const dept of departments) {
        const created = await prisma.department.create({ data: dept });
        createdDepts.push(created);
    }

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 12);
    const officerPassword = await bcrypt.hash("officer123", 12);
    const citizenPassword = await bcrypt.hash("citizen123", 12);

    // Seed Admin
    console.log("👑 Creating admin user...");
    const admin = await prisma.user.create({
        data: {
            email: "admin@jansankalp.ai",
            name: "System Administrator",
            role: "ADMIN",
            password: adminPassword,
            emailVerified: new Date(),
            phone: "+91-9876543200",
            address: "Municipal Corporation, Bangalore"
        }
    });

    // Seed Officers (5 officers for different departments)
    console.log("👔 Creating officers...");
    const officers = [
        {
            email: "waste.officer@jansankalp.ai",
            name: "Rajesh Kumar",
            role: "OFFICER" as const,
            password: officerPassword,
            emailVerified: new Date(),
            phone: "+91-9876543201",
            departmentId: createdDepts[0].id // Waste Management
        },
        {
            email: "roads.officer@jansankalp.ai",
            name: "Priya Sharma",
            role: "OFFICER" as const,
            password: officerPassword,
            emailVerified: new Date(),
            phone: "+91-9876543202",
            departmentId: createdDepts[1].id // Roads & Infrastructure
        },
        {
            email: "water.officer@jansankalp.ai",
            name: "Amit Patel",
            role: "OFFICER" as const,
            password: officerPassword,
            emailVerified: new Date(),
            phone: "+91-9876543203",
            departmentId: createdDepts[2].id // Water Supply
        },
        {
            email: "health.officer@jansankalp.ai",
            name: "Sneha Reddy",
            role: "OFFICER" as const,
            password: officerPassword,
            emailVerified: new Date(),
            phone: "+91-9876543204",
            departmentId: createdDepts[4].id // Public Health
        },
        {
            email: "traffic.officer@jansankalp.ai",
            name: "Vikram Singh",
            role: "OFFICER" as const,
            password: officerPassword,
            emailVerified: new Date(),
            phone: "+91-9876543205",
            departmentId: createdDepts[7].id // Traffic Control
        }
    ];

    const createdOfficers = [];
    for (const officer of officers) {
        const created = await prisma.user.create({
            data: {
                email: officer.email,
                name: officer.name,
                role: officer.role,
                password: officer.password,
                emailVerified: officer.emailVerified,
                phone: officer.phone
            }
        });
        createdOfficers.push(created);

        // Update department head
        await prisma.department.update({
            where: { id: officer.departmentId },
            data: { headId: created.id }
        });
    }

    // Seed Citizens (20 citizens with diverse data)
    console.log("👥 Creating citizens...");
    const citizens = [
        {
            email: "rahul.sharma@email.com",
            name: "Rahul Sharma",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543210",
            address: "123 MG Road, Bangalore",
            latitude: 12.9716,
            longitude: 77.5946,
            points: 150
        },
        {
            email: "priya.patel@email.com",
            name: "Priya Patel",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543211",
            address: "456 Brigade Road, Bangalore",
            latitude: 12.9756,
            longitude: 77.5926,
            points: 230
        },
        {
            email: "amit.kumar@email.com",
            name: "Amit Kumar",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543212",
            address: "789 Commercial Street, Bangalore",
            latitude: 12.9786,
            longitude: 77.5906,
            points: 180
        },
        {
            email: "sneha.reddy@email.com",
            name: "Sneha Reddy",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543213",
            address: "321 Residency Road, Bangalore",
            latitude: 12.9726,
            longitude: 77.5966,
            points: 120
        },
        {
            email: "vikram.singh@email.com",
            name: "Vikram Singh",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543214",
            address: "654 Infantry Road, Bangalore",
            latitude: 12.9796,
            longitude: 77.5896,
            points: 200
        },
        {
            email: "anjali.mehta@email.com",
            name: "Anjali Mehta",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543215",
            address: "987 Cunningham Road, Bangalore",
            latitude: 12.9736,
            longitude: 77.5976,
            points: 90
        },
        {
            email: "rohit.verma@email.com",
            name: "Rohit Verma",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543216",
            address: "147 Richmond Road, Bangalore",
            latitude: 12.9766,
            longitude: 77.5936,
            points: 160
        },
        {
            email: "kavita.nair@email.com",
            name: "Kavita Nair",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543217",
            address: "258 St. Mark's Road, Bangalore",
            latitude: 12.9746,
            longitude: 77.5956,
            points: 140
        },
        {
            email: "arjun.gupta@email.com",
            name: "Arjun Gupta",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543218",
            address: "363 Museum Road, Bangalore",
            latitude: 12.9776,
            longitude: 77.5916,
            points: 110
        },
        {
            email: "divya.sharma@email.com",
            name: "Divya Sharma",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543219",
            address: "741 Lavelle Road, Bangalore",
            latitude: 12.9706,
            longitude: 77.5986,
            points: 190
        },
        {
            email: "karthik.rao@email.com",
            name: "Karthik Rao",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543220",
            address: "852 Vittal Mallya Road, Bangalore",
            latitude: 12.9786,
            longitude: 77.5886,
            points: 80
        },
        {
            email: "meera.iyer@email.com",
            name: "Meera Iyer",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543221",
            address: "963 UB City, Bangalore",
            latitude: 12.9796,
            longitude: 77.5876,
            points: 250
        },
        {
            email: "naveen.jain@email.com",
            name: "Naveen Jain",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543222",
            address: "147 Church Street, Bangalore",
            latitude: 12.9716,
            longitude: 77.5996,
            points: 130
        },
        {
            email: "swati.desai@email.com",
            name: "Swati Desai",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543223",
            address: "258 Brigade Road, Bangalore",
            latitude: 12.9756,
            longitude: 77.5926,
            points: 170
        },
        {
            email: "ramesh.kumar@email.com",
            name: "Ramesh Kumar",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543224",
            address: "369 Commercial Street, Bangalore",
            latitude: 12.9786,
            longitude: 77.5906,
            points: 100
        },
        {
            email: "geeta.rani@email.com",
            name: "Geeta Rani",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543225",
            address: "741 Residency Road, Bangalore",
            latitude: 12.9726,
            longitude: 77.5966,
            points: 210
        },
        {
            email: "suresh.menon@email.com",
            name: "Suresh Menon",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543226",
            address: "852 Infantry Road, Bangalore",
            latitude: 12.9796,
            longitude: 77.5896,
            points: 60
        },
        {
            email: "anita.pillai@email.com",
            name: "Anita Pillai",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543227",
            address: "963 Cunningham Road, Bangalore",
            latitude: 12.9736,
            longitude: 77.5976,
            points: 150
        },
        {
            email: "manoj.shah@email.com",
            name: "Manoj Shah",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543228",
            address: "147 Richmond Road, Bangalore",
            latitude: 12.9766,
            longitude: 77.5936,
            points: 95
        },
        {
            email: "pooja.sinha@email.com",
            name: "Pooja Sinha",
            role: "CITIZEN" as const,
            password: citizenPassword,
            emailVerified: new Date(),
            phone: "+91-9876543229",
            address: "258 St. Mark's Road, Bangalore",
            latitude: 12.9746,
            longitude: 77.5956,
            points: 185
        }
    ];

    const createdCitizens = [];
    for (const citizen of citizens) {
        const created = await prisma.user.create({ data: citizen });
        createdCitizens.push(created);
    }

    // Seed Complaints (30+ complaints with various statuses)
    console.log("📋 Creating complaints...");
    const complaintTypes = [
        "Garbage", "Road damage", "Water leakage", "Street light", "Drainage", 
        "Noise pollution", "Illegal construction", "Tree falling", "Public toilet",
        "Traffic jam", "Mosquito menace", "Stray animals", "Broken pipeline",
        "Encroachment", "Electricity issue"
    ];

    const statuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const;
    
    const complaints = [];
    let ticketCounter = 10001;

    // Create complaints for each citizen
    for (let i = 0; i < createdCitizens.length; i++) {
        const citizen = createdCitizens[i];
        const numComplaints = Math.floor(Math.random() * 3) + 1; // 1-3 complaints per citizen

        for (let j = 0; j < numComplaints; j++) {
            const category = complaintTypes[Math.floor(Math.random() * complaintTypes.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const severity = Math.floor(Math.random() * 5) + 1; // 1-5
            const department = createdDepts[Math.floor(Math.random() * createdDepts.length)];
            
            // Random location near Bangalore
            const lat = 12.9716 + (Math.random() - 0.5) * 0.02;
            const lng = 77.5946 + (Math.random() - 0.5) * 0.02;

            const complaint = {
                ticketId: `JSK-2026-${ticketCounter++}`,
                title: `${category} issue near ${(citizen.address || 'location').split(',')[0]}`,
                description: `This is a sample complaint about ${category.toLowerCase()} in the area. The issue has been persisting for some time and needs immediate attention from the concerned authorities.`,
                category,
                severity,
                latitude: lat,
                longitude: lng,
                status,
                authorId: citizen.id,
                departmentId: department.id,
                imageUrl: `https://picsum.photos/seed/complaint${ticketCounter}/400/300.jpg`
            };

            complaints.push(complaint);
        }
    }

    // Create all complaints
    const createdComplaints = [];
    for (const complaint of complaints) {
        const created = await prisma.complaint.create({ data: complaint });
        createdComplaints.push(created);

        // Add some remarks to resolved complaints
        if (created.status === "RESOLVED") {
            await prisma.remark.create({
                data: {
                    text: "Issue has been resolved by the concerned department. Thank you for your patience.",
                    authorName: createdOfficers[Math.floor(Math.random() * createdOfficers.length)].name || 'Officer',
                    authorRole: "OFFICER",
                    complaintId: created.id
                }
            });
        }

        // Add remarks to in-progress complaints
        if (created.status === "IN_PROGRESS") {
            await prisma.remark.create({
                data: {
                    text: "Team has been assigned to resolve this issue. Work is in progress.",
                    authorName: createdOfficers[Math.floor(Math.random() * createdOfficers.length)].name || 'Officer',
                    authorRole: "OFFICER",
                    complaintId: created.id
                }
            });
        }
    }

    // Create audit logs
    console.log("📊 Creating audit logs...");
    const auditActions = [
        "USER_REGISTERED", "COMPLAINT_CREATED", "COMPLAINT_ASSIGNED", 
        "COMPLAINT_RESOLVED", "USER_LOGIN", "PASSWORD_RESET"
    ];

    for (let i = 0; i < 50; i++) {
        const user = [admin, ...createdOfficers, ...createdCitizens][Math.floor(Math.random() * (1 + createdOfficers.length + createdCitizens.length))];
        const action = auditActions[Math.floor(Math.random() * auditActions.length)];
        
        await prisma.auditLog.create({
            data: {
                action,
                userId: user.id,
                details: `Sample audit log entry for ${action} by ${user.name || 'Unknown'}`,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
            }
        });
    }

    // Summary
    console.log("\n✅ Seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`👑 Admin: 1 (admin@jansankalp.ai / admin123)`);
    console.log(`👔 Officers: ${createdOfficers.length}`);
    console.log(`👥 Citizens: ${createdCitizens.length}`);
    console.log(`📁 Departments: ${createdDepts.length}`);
    console.log(`📋 Complaints: ${createdComplaints.length}`);
    console.log(`📊 Audit Logs: 50`);
    
    console.log("\n🔑 Login Credentials:");
    console.log("Admin: admin@jansankalp.ai / admin123");
    console.log("Officers: [name].officer@jansankalp.ai / officer123");
    console.log("Citizens: [name].[lastname]@email.com / citizen123");
    
    console.log("\n🎯 Admin can:");
    console.log("• View all users and their details");
    console.log("• Monitor all complaints");
    console.log("• Assign complaints to officers");
    console.log("• Verify user registrations");
    console.log("• View audit logs and system statistics");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
