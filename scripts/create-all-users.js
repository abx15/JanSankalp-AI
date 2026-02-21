const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAllUsers() {
  try {
    console.log('👥 Creating all user roles for testing...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const officerPassword = await bcrypt.hash('officer123', 12);
    const citizenPassword = await bcrypt.hash('citizen123', 12);

    // Create Admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@jansankalp.ai' },
      update: { password: adminPassword, emailVerified: new Date() },
      create: {
        email: 'admin@jansankalp.ai',
        name: 'System Administrator',
        role: 'ADMIN',
        password: adminPassword,
        emailVerified: new Date(),
        phone: '+91-9876543200',
        address: 'Municipal Corporation, Bangalore'
      }
    });

    // Create Officer
    const officer = await prisma.user.upsert({
      where: { email: 'officer@jansankalp.ai' },
      update: { password: officerPassword, emailVerified: new Date() },
      create: {
        email: 'officer@jansankalp.ai',
        name: 'Municipal Officer',
        role: 'OFFICER',
        password: officerPassword,
        emailVerified: new Date(),
        phone: '+91-9876543201',
        address: 'Municipal Office, Bangalore'
      }
    });

    // Create Citizen
    const citizen = await prisma.user.upsert({
      where: { email: 'citizen@jansankalp.ai' },
      update: { password: citizenPassword, emailVerified: new Date() },
      create: {
        email: 'citizen@jansankalp.ai',
        name: 'Rahul Citizen',
        role: 'CITIZEN',
        password: citizenPassword,
        emailVerified: new Date(),
        phone: '+91-9876543202',
        address: 'Bangalore, Karnataka'
      }
    });

    console.log('✅ All users created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN:');
    console.log('   Email: admin@jansankalp.ai');
    console.log('   Password: admin123');
    console.log('   Dashboard: /dashboard/admin');
    console.log('');
    console.log('👔 OFFICER:');
    console.log('   Email: officer@jansankalp.ai');
    console.log('   Password: officer123');
    console.log('   Dashboard: /dashboard/officer');
    console.log('');
    console.log('👤 CITIZEN:');
    console.log('   Email: citizen@jansankalp.ai');
    console.log('   Password: citizen123');
    console.log('   Dashboard: /dashboard');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAllUsers();
