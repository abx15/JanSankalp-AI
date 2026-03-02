const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    await prisma.notification.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();

    // Create Departments
    console.log('📁 Creating departments...');
    const departments = await Promise.all([
      prisma.department.create({
        data: {
          name: 'Water Supply',
          code: 'WATER',
          description: 'Water supply and sanitation services',
          headOfficer: 'Rajesh Kumar',
          contactEmail: 'water@jansankalp.gov.in',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Electricity',
          code: 'ELECTRICITY',
          description: 'Power distribution and electrical services',
          headOfficer: 'Priya Sharma',
          contactEmail: 'electricity@jansankalp.gov.in',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Roads & Transport',
          code: 'ROADS',
          description: 'Road maintenance and transport services',
          headOfficer: 'Amit Verma',
          contactEmail: 'roads@jansankalp.gov.in',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Health & Sanitation',
          code: 'HEALTH',
          description: 'Public health and sanitation services',
          headOfficer: 'Dr. Sunita Reddy',
          contactEmail: 'health@jansankalp.gov.in',
        },
      }),
      prisma.department.create({
        data: {
          name: 'Education',
          code: 'EDUCATION',
          description: 'Educational institutions and services',
          headOfficer: 'Prof. Meera Joshi',
          contactEmail: 'education@jansankalp.gov.in',
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
          verified: true,
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
          verified: true,
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
          verified: true,
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
          verified: true,
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
          verified: true,
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
          verified: true,
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
          verified: true,
          points: 750,
          departmentId: departments[0].id, // Water Supply
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
          verified: true,
          points: 720,
          departmentId: departments[1].id, // Electricity
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
          verified: true,
          points: 680,
          departmentId: departments[2].id, // Roads
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
          verified: true,
          points: 700,
          departmentId: departments[3].id, // Health
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
          verified: true,
          points: 690,
          departmentId: departments[4].id, // Education
        },
      }),
    ]);

    console.log(`✅ Created ${officerUsers.length} officer users`);

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
          verified: true,
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
          verified: true,
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
          verified: true,
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
          verified: true,
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
          verified: true,
          points: 160,
        },
      }),
    ]);

    console.log(`✅ Created ${citizenUsers.length} citizen users`);

    // Create Sample Complaints
    console.log('📋 Creating sample complaints...');
    const complaintData = [
      {
        title: 'Water Supply Disruption in Sector 15',
        description: 'No water supply for the past 3 days in Sector 15, affecting over 500 families.',
        category: 'Water Supply',
        severity: 4,
        status: 'PENDING',
        location: 'Sector 15, Delhi',
        authorId: citizenUsers[0].id,
        departmentId: departments[0].id,
        assignedToId: officerUsers[0].id,
      },
      {
        title: 'Street Lights Not Working on Main Road',
        description: 'All street lights on the main road are not working for 2 weeks, causing safety concerns.',
        category: 'Electricity',
        severity: 3,
        status: 'IN_PROGRESS',
        location: 'Main Road, Delhi',
        authorId: citizenUsers[1].id,
        departmentId: departments[1].id,
        assignedToId: officerUsers[1].id,
      },
      {
        title: 'Pothole Repair Needed on Highway',
        description: 'Large potholes on the national highway causing accidents and vehicle damage.',
        category: 'Roads & Transport',
        severity: 5,
        status: 'RESOLVED',
        location: 'National Highway, Delhi',
        authorId: citizenUsers[2].id,
        departmentId: departments[2].id,
        assignedToId: officerUsers[2].id,
        officerNotes: 'Potholes repaired with high-quality asphalt. Work completed on time.',
      },
      {
        title: 'Garbage Collection Issue',
        description: 'Garbage not being collected for a week in residential area.',
        category: 'Health & Sanitation',
        severity: 3,
        status: 'PENDING',
        location: 'Residential Area, Delhi',
        authorId: citizenUsers[3].id,
        departmentId: departments[3].id,
        assignedToId: officerUsers[3].id,
      },
      {
        title: 'School Building Repair Required',
        description: 'School building needs urgent repair due to rain damage.',
        category: 'Education',
        severity: 4,
        status: 'IN_PROGRESS',
        location: 'Government School, Delhi',
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
          relatedId: complaints[0].id,
        },
      }),
      prisma.notification.create({
        data: {
          title: 'Complaint Resolved',
          message: 'Your complaint has been resolved: Pothole Repair Needed',
          userId: citizenUsers[2].id,
          type: 'COMPLAINT_RESOLVED',
          relatedId: complaints[2].id,
        },
      }),
      prisma.notification.create({
        data: {
          title: 'New Complaint Filed',
          message: 'A new complaint has been filed in your department',
          userId: adminUsers[0].id,
          type: 'NEW_COMPLAINT',
          relatedId: complaints[3].id,
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
