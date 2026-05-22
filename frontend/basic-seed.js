const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting basic seed...');

  try {
    // Create Admin
    const adminPassword = await bcrypt.hash('password123', 12);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@jansankalp.gov.in',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Created admin user');

    // Create Officer
    const officerPassword = await bcrypt.hash('password123', 12);
    const officer = await prisma.user.create({
      data: {
        email: 'officer@jansankalp.gov.in',
        name: 'Officer User',
        password: officerPassword,
        role: 'OFFICER',
      },
    });

    console.log('✅ Created officer user');

    // Create Citizen
    const citizenPassword = await bcrypt.hash('password123', 12);
    const citizen = await prisma.user.create({
      data: {
        email: 'citizen@example.com',
        name: 'Citizen User',
        password: citizenPassword,
        role: 'CITIZEN',
      },
    });

    console.log('✅ Created citizen user');

    // Create sample departments
    const dept1 = await prisma.department.create({
      data: {
        name: 'Water Department',
      },
    });

    const dept2 = await prisma.department.create({
      data: {
        name: 'Road Department',
      },
    });

    console.log('✅ Created departments');

    // Create sample complaints
    await prisma.complaint.create({
      data: {
        title: 'Water leakage in main pipe',
        description: 'There is a water leakage in the main pipe near the market area',
        status: 'PENDING',
        severity: 3,
        ticketId: `JSK-${new Date().getFullYear()}-1001`,
        authorId: citizen.id,
        departmentId: dept1.id,
        region: 'Market Area',
      },
    });

    await prisma.complaint.create({
      data: {
        title: 'Pothole on main road',
        description: 'Large pothole causing traffic issues',
        status: 'IN_PROGRESS',
        severity: 4,
        ticketId: `JSK-${new Date().getFullYear()}-1002`,
        authorId: citizen.id,
        departmentId: dept2.id,
        region: 'Main Street',
        assignedToId: officer.id,
      },
    });

    console.log('✅ Created sample complaints');

    console.log('\n🎉 Basic seed completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('👤 Admin: admin@jansankalp.gov.in (password: password123)');
    console.log('👮 Officer: officer@jansankalp.gov.in (password: password123)');
    console.log('👤 Citizen: citizen@example.com (password: password123)');

  } catch (error) {
    console.error('❌ Seed failed:', error);
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
