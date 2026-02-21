const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('👑 Creating admin user...');

    // Hash password
    const password = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@jansankalp.ai' },
      update: { 
        password: password,
        emailVerified: new Date()
      },
      create: {
        email: 'admin@jansankalp.ai',
        name: 'System Administrator',
        role: 'ADMIN',
        password: password,
        emailVerified: new Date(),
        phone: '+91-9876543200',
        address: 'Municipal Corporation, Bangalore'
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@jansankalp.ai');
    console.log('🔑 Password: admin123');
    console.log('👤 Name:', admin.name);
    console.log('🔐 Role:', admin.role);

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
