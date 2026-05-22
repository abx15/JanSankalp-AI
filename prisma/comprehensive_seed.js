const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // Clean existing data in correct dependency order to prevent foreign key violations
    console.log('🧹 Cleaning existing data...');
    
    // Child tables of Complaint, User, and Conversation
    await prisma.remark.deleteMany().catch(() => {});
    await prisma.notification.deleteMany().catch(() => {});
    await prisma.threatLog.deleteMany().catch(() => {});
    await prisma.message.deleteMany().catch(() => {});
    await prisma.userConversation.deleteMany().catch(() => {});
    await prisma.conversation.deleteMany().catch(() => {});
    
    // Budget & Forecasting tables
    await prisma.budgetForecast.deleteMany().catch(() => {});
    await prisma.budgetActual.deleteMany().catch(() => {});
    await prisma.costOptimization.deleteMany().catch(() => {});
    await prisma.demandSurge.deleteMany().catch(() => {});
    
    // Sovereign AI Geopolitical tables
    await prisma.sDGTarget.deleteMany().catch(() => {});
    await prisma.policySimulation.deleteMany().catch(() => {});
    await prisma.digitalTwinNode.deleteMany().catch(() => {});
    await prisma.nationalCrisis.deleteMany().catch(() => {});
    await prisma.sovereignNode.deleteMany().catch(() => {});
    
    // Main business entity tables
    await prisma.complaint.deleteMany().catch(() => {});
    
    // Resolve circular dependency between Department head and User by disconnecting headId first
    await prisma.department.updateMany({ data: { headId: null } }).catch(() => {});
    
    await prisma.user.deleteMany().catch(() => {});
    await prisma.department.deleteMany().catch(() => {});
    
    // Subscription & Tenancy tables
    await prisma.subscription.deleteMany().catch(() => {});
    await prisma.tenant.deleteMany().catch(() => {});
    
    // Location tables
    await prisma.ward.deleteMany().catch(() => {});
    await prisma.city.deleteMany().catch(() => {});
    await prisma.district.deleteMany().catch(() => {});
    await prisma.state.deleteMany().catch(() => {});
    
    // Other token tables
    await prisma.verificationToken.deleteMany().catch(() => {});
    await prisma.passwordResetToken.deleteMany().catch(() => {});
    await prisma.auditLog.deleteMany().catch(() => {});

    // Create Departments
    console.log('📁 Creating departments...');
    const departments = await Promise.all([
      prisma.department.create({
        data: {
          name: 'Water Supply',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Electricity',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Roads & Transport',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Health & Sanitation',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Education',
        },
      }),
    ]);

    console.log(`✅ Created ${departments.length} departments`);

    // Create Admin Users (5+ as requested)
    console.log('👑 Creating admin users...');
    const adminUsers = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Arun Kumar Bind',
          email: 'admin@jansankalp.gov.in',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          phone: '+919876543210',
          address: '123 Admin Block, Delhi',

          points: 1000,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Rajesh Kumar',
          email: 'rajesh.admin@jansankalp.gov.in',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          phone: '+919876543211',
          address: '124 Admin Block, Delhi',

          points: 950,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Priya Sharma',
          email: 'priya.admin@jansankalp.gov.in',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          phone: '+919876543212',
          address: '125 Admin Block, Delhi',

          points: 900,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Amit Verma',
          email: 'amit.admin@jansankalp.gov.in',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          phone: '+919876543213',
          address: '126 Admin Block, Delhi',

          points: 880,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Sunita Reddy',
          email: 'sunita.admin@jansankalp.gov.in',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          phone: '+919876543214',
          address: '127 Admin Block, Delhi',

          points: 920,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Meera Joshi',
          email: 'meera.admin@jansankalp.gov.in',
          password: await bcrypt.hash('admin123', 10),
          role: 'ADMIN',
          phone: '+919876543215',
          address: '128 Admin Block, Delhi',

          points: 870,
        },
      }),
    ]);

    console.log(`✅ Created ${adminUsers.length} admin users`);

    // Create Officer Users
    console.log('👮‍♂️ Creating officer users...');
    const officerUsers = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Lokesh Sharma',
          email: 'lokesh.sharma@jansankalp.gov.in',
          password: await bcrypt.hash('officer123', 10),
          role: 'OFFICER',
          phone: '+919876543220',
          address: '456 Officer Quarters, Delhi',
          points: 750,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Anjali Patel',
          email: 'anjali.patel@jansankalp.gov.in',
          password: await bcrypt.hash('officer123', 10),
          role: 'OFFICER',
          phone: '+919876543221',
          address: '457 Officer Quarters, Delhi',
          points: 720,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Vikram Singh',
          email: 'vikram.singh@jansankalp.gov.in',
          password: await bcrypt.hash('officer123', 10),
          role: 'OFFICER',
          phone: '+919876543222',
          address: '458 Officer Quarters, Delhi',
          points: 680,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Kavita Reddy',
          email: 'kavita.reddy@jansankalp.gov.in',
          password: await bcrypt.hash('officer123', 10),
          role: 'OFFICER',
          phone: '+919876543223',
          address: '459 Officer Quarters, Delhi',
          points: 700,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Rahul Kumar',
          email: 'rahul.kumar@jansankalp.gov.in',
          password: await bcrypt.hash('officer123', 10),
          role: 'OFFICER',
          phone: '+919876543224',
          address: '460 Officer Quarters, Delhi',
          points: 690,
        },
      }),
    ]);

    console.log(`✅ Created ${officerUsers.length} officer users`);

    // Assign officers as heads of departments
    console.log('🔗 Linking officer users as department heads...');
    await Promise.all([
      prisma.department.update({
        where: { id: departments[0].id },
        data: { headId: officerUsers[0].id },
      }),
      prisma.department.update({
        where: { id: departments[1].id },
        data: { headId: officerUsers[1].id },
      }),
      prisma.department.update({
        where: { id: departments[2].id },
        data: { headId: officerUsers[2].id },
      }),
      prisma.department.update({
        where: { id: departments[3].id },
        data: { headId: officerUsers[3].id },
      }),
      prisma.department.update({
        where: { id: departments[4].id },
        data: { headId: officerUsers[4].id },
      }),
    ]);
    console.log('✅ Department heads linked successfully');

    // Create Citizen Users
    console.log('👥 Creating citizen users...');
    const citizenUsers = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Arun Kumar',
          email: 'arun.kumar@example.com',
          password: await bcrypt.hash('citizen123', 10),
          role: 'CITIZEN',
          phone: '+919876543230',
          address: '789 Residential Area, Delhi',

          points: 250,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Priya Nair',
          email: 'priya.nair@example.com',
          password: await bcrypt.hash('citizen123', 10),
          role: 'CITIZEN',
          phone: '+919876543231',
          address: '790 Residential Area, Delhi',

          points: 220,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Amit Patel',
          email: 'amit.patel@example.com',
          password: await bcrypt.hash('citizen123', 10),
          role: 'CITIZEN',
          phone: '+919876543232',
          address: '791 Residential Area, Delhi',

          points: 180,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Sunita Sharma',
          email: 'sunita.sharma@example.com',
          password: await bcrypt.hash('citizen123', 10),
          role: 'CITIZEN',
          phone: '+919876543233',
          address: '792 Residential Area, Delhi',

          points: 200,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Rahul Verma',
          email: 'rahul.verma@example.com',
          password: await bcrypt.hash('citizen123', 10),
          role: 'CITIZEN',
          phone: '+919876543234',
          address: '793 Residential Area, Delhi',

          points: 160,
        },
      }),
    ]);

    console.log(`✅ Created ${citizenUsers.length} citizen users`);

    // Create Sample Complaints
    console.log('📋 Creating sample complaints...');
    const complaintData = [
      {
        ticketId: 'TKT-2026-001',
        title: 'Water Supply Disruption in Sector 15',
        description: 'No water supply for the past 3 days in Sector 15, affecting over 500 families.',
        category: 'Water Supply',
        severity: 4,
        status: 'PENDING',
        latitude: 28.6139,
        longitude: 77.2090,
        authorId: citizenUsers[0].id,
        departmentId: departments[0].id,
        assignedToId: officerUsers[0].id,
      },
      {
        ticketId: 'TKT-2026-002',
        title: 'Street Lights Not Working on Main Road',
        description: 'All street lights on the main road are not working for 2 weeks, causing safety concerns.',
        category: 'Electricity',
        severity: 3,
        status: 'IN_PROGRESS',
        latitude: 28.6250,
        longitude: 77.2200,
        authorId: citizenUsers[1].id,
        departmentId: departments[1].id,
        assignedToId: officerUsers[1].id,
      },
      {
        ticketId: 'TKT-2026-003',
        title: 'Pothole Repair Needed on Highway',
        description: 'Large potholes on the national highway causing accidents and vehicle damage.',
        category: 'Roads & Transport',
        severity: 5,
        status: 'RESOLVED',
        latitude: 28.6300,
        longitude: 77.2300,
        authorId: citizenUsers[2].id,
        departmentId: departments[2].id,
        assignedToId: officerUsers[2].id,
      },
      {
        ticketId: 'TKT-2026-004',
        title: 'Garbage Collection Issue',
        description: 'Garbage not being collected for a week in residential area.',
        category: 'Health & Sanitation',
        severity: 3,
        status: 'PENDING',
        latitude: 28.6400,
        longitude: 77.2400,
        authorId: citizenUsers[3].id,
        departmentId: departments[3].id,
        assignedToId: officerUsers[3].id,
      },
      {
        ticketId: 'TKT-2026-005',
        title: 'School Building Repair Required',
        description: 'School building needs urgent repair due to rain damage.',
        category: 'Education',
        severity: 4,
        status: 'IN_PROGRESS',
        latitude: 28.6500,
        longitude: 77.2500,
        authorId: citizenUsers[4].id,
        departmentId: departments[4].id,
        assignedToId: officerUsers[4].id,
      },
    ];

    const complaints = await Promise.all(
      complaintData.map(data => 
        prisma.complaint.create({ data })
      )
    );

    console.log(`✅ Created ${complaints.length} sample complaints`);

    // Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          title: 'New Complaint Assigned',
          message: 'You have been assigned a new complaint: Water Supply Disruption',
          userId: officerUsers[0].id,
          type: 'COMPLAINT_ASSIGNED',
          complaintId: complaints[0].id,
        },
      }),
      prisma.notification.create({
        data: {
          title: 'Complaint Resolved',
          message: 'Your complaint has been resolved: Pothole Repair Needed',
          userId: citizenUsers[2].id,
          type: 'COMPLAINT_RESOLVED',
          complaintId: complaints[2].id,
        },
      }),
      prisma.notification.create({
        data: {
          title: 'New Complaint Filed',
          message: 'A new complaint has been filed in your department',
          userId: adminUsers[0].id,
          type: 'NEW_COMPLAINT',
          complaintId: complaints[3].id,
        },
      }),
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👑 Admin Users: ${adminUsers.length}`);
    console.log(`   👮‍♂️ Officer Users: ${officerUsers.length}`);
    console.log(`   👥 Citizen Users: ${citizenUsers.length}`);
    console.log(`   📁 Departments: ${departments.length}`);
    console.log(`   📋 Complaints: ${complaints.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin Users (Password: admin123):');
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.email}`);
    });
    console.log('\n   Officer Users (Password: officer123):');
    officerUsers.forEach(officer => {
      console.log(`   - ${officer.email}`);
    });
    console.log('\n   Citizen Users (Password: citizen123):');
    citizenUsers.forEach(citizen => {
      console.log(`   - ${citizen.email}`);
    });

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
