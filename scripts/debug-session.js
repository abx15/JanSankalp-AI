const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugSession() {
  try {
    console.log('🔍 Debugging admin session...');
    
    // Check if admin user exists
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@jansankalp.ai' }
    });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔐 Role:', admin.role);
    console.log('📅 Email Verified:', admin.emailVerified);
    console.log('🔑 Password Hash exists:', !!admin.password);
    
    // Test password verification
    const isValidPassword = await bcrypt.compare('admin123', admin.password);
    console.log('🔓 Password verification:', isValidPassword ? '✅ Valid' : '❌ Invalid');
    
    // Check NextAuth tables
    const sessions = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%session%'`;
    console.log('🗃️ Session tables:', sessions);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSession();
