const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple seed...');

  // Create Admin
  const adminPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jansankalp.gov.in' },
    update: {},
    create: {
      email: 'admin@jansankalp.gov.in',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Officer
  const officerPassword = await bcrypt.hash('password123', 12);
  const officer = await prisma.user.upsert({
    where: { email: 'officer@jansankalp.gov.in' },
    update: {},
    create: {
      email: 'officer@jansankalp.gov.in',
      name: 'Officer User',
      password: officerPassword,
      role: 'OFFICER',
    },
  });

  // Create Citizen
  const citizenPassword = await bcrypt.hash('password123', 12);
  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@example.com' },
    update: {},
    create: {
      email: 'citizen@example.com',
      name: 'Citizen User',
      password: citizenPassword,
      role: 'CITIZEN',
    },
  });

  // Create sample departments
  const dept1 = await prisma.department.create({
    data: {
      name: 'Water Department',
      description: 'Handles water supply issues',
    },
  });

  const dept2 = await prisma.department.create({
    data: {
      name: 'Road Department',
      description: 'Handles road maintenance issues',
    },
  });

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

  console.log('✅ Simple seed completed!');
  console.log('👤 Admin: admin@jansankalp.gov.in (password: password123)');
  console.log('👮 Officer: officer@jansankalp.gov.in (password: password123)');
  console.log('👤 Citizen: citizen@example.com (password: password123)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
