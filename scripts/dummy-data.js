const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addDummyData() {
    console.log("🌱 Adding dummy complaint data for real-time testing...");
    
    try {
        // Get all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        const officers = users.filter(u => u.role === "OFFICER");
        const citizens = users.filter(u => u.role === "CITIZEN");

        if (officers.length === 0 || citizens.length === 0) {
            console.log("❌ No users found in database");
            return;
        }

        // Create dummy complaints
        const dummyComplaints = [
            {
                ticketId: `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
                title: "Pothole on Main Street",
                description: "Large pothole causing traffic issues near the metro station",
                category: "pothole",
                severity: 4,
                status: "PENDING",
                latitude: 28.6139,
                longitude: 77.2090,
                authorId: citizens[0]?.id,
                assignedToId: officers[0]?.id,
            },
            {
                ticketId: `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
                title: "Broken Streetlight",
                description: "Streetlight is off for 3 days near Block B",
                category: "streetlight",
                severity: 2,
                status: "IN_PROGRESS",
                latitude: 28.6200,
                longitude: 77.2100,
                authorId: citizens[1]?.id,
                assignedToId: officers[1]?.id,
            },
            {
                ticketId: `JSK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
                title: "Garbage Overflow",
                description: "Garbage not collected from residential area",
                category: "garbage",
                severity: 3,
                status: "RESOLVED",
                latitude: 28.6300,
                longitude: 77.2200,
                authorId: citizens[2]?.id,
                assignedToId: officers[0]?.id,
            },
        ];

        // Add complaints to database
        for (const complaint of dummyComplaints) {
            const createdComplaint = await prisma.complaint.create({
                data: {
                    ...complaint,
                    createdAt: new Date(),
                },
            });
            
            console.log(`✅ Created complaint: ${createdComplaint.ticketId}`);

            // Send notification to complaint author
            try {
                await prisma.notification.create({
                    data: {
                        userId: complaint.authorId,
                        type: "STATUS_UPDATE",
                        title: "Status: " + complaint.status,
                        message: `Your complaint ${createdComplaint.ticketId} status has been updated to ${complaint.status}`,
                        complaintId: createdComplaint.id,
                    }
                });
                console.log(`📧 Notification created for user: ${citizens[complaint.authorId]?.name || 'Unknown'}`);
            } catch (error) {
                console.error("❌ Failed to create notification:", error);
            }
        }

        console.log("🎉 Dummy data added successfully!");
        console.log(`📊 Created ${dummyComplaints.length} complaints`);
        console.log(`👥 Assigned to ${officers.length} officers`);
        console.log(`👥 Created for ${citizens.length} citizens`);

    } catch (error) {
        console.error("❌ Error adding dummy data:", error);
    }
}

async function simulateRealTimeUpdates() {
    console.log("🔄 Starting real-time simulation...");
    
    try {
        // Get pending complaints
        const pendingComplaints = await prisma.complaint.findMany({
            where: { status: "PENDING" },
            include: {
                author: { select: { name: true } },
                assignedTo: { select: { name: true } },
            },
        });

        console.log(`📋 Found ${pendingComplaints.length} pending complaints`);

        // Simulate officer resolving complaints
        for (const complaint of pendingComplaints.slice(0, 2)) {
            console.log(`🔧 Simulating resolution for complaint: ${complaint.ticketId}`);
            
            // Update complaint status
            const updatedComplaint = await prisma.complaint.update({
                where: { id: complaint.id },
                data: {
                    status: "RESOLVED",
                    assignedToId: complaint.assignedToId,
                },
                include: {
                    author: { select: { name: true } },
                    assignedTo: { select: { name: true } },
                },
            });

            console.log(`✅ Resolved complaint: ${updatedComplaint.ticketId}`);

            // Send real-time notification
            try {
                await prisma.notification.create({
                    data: {
                        userId: updatedComplaint.authorId,
                        type: "RESOLVED",
                        title: "Issue Resolved",
                        message: `Your complaint ${updatedComplaint.ticketId} has been resolved successfully!`,
                        complaintId: updatedComplaint.id,
                    }
                });
                console.log(`📧 Notification sent to user: ${updatedComplaint.authorId || 'Unknown'}`);
            } catch (error) {
                console.error("❌ Failed to create user notification:", error);
            }
        }

        console.log("🎯 Real-time simulation completed!");
    } catch (error) {
        console.error("❌ Error in real-time simulation:", error);
    }
}

// Main function to run both
async function main() {
    console.log("🚀 Starting dummy data and real-time simulation...");
    
    await addDummyData();
    
    // Wait a bit before starting simulation
    setTimeout(async () => {
        await simulateRealTimeUpdates();
    }, 2000);

    console.log("✅ Script completed successfully!");
}

// Run if called directly
if (require.main === module) {
    main();
}
