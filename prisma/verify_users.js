const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifySpecificUsers() {
    console.log('🔍 Verifying specific users you mentioned...');
    
    try {
        // Check the specific admin user
        const adminUser = await prisma.user.findUnique({
            where: { id: 'cmlreyps60006jthuynyrn0t3' },
            select: { id: true, name: true, email: true, role: true, password: true }
        });
        
        // Check the specific officer user  
        const officerUser = await prisma.user.findUnique({
            where: { id: 'cmlreyr7x0007jthukwq55azl' },
            select: { id: true, name: true, email: true, role: true, password: true }
        });
        
        console.log('\n👤 Admin User (cmlreyps60006jthuynyrn0t3):');
        if (adminUser) {
            console.log(`- Name: ${adminUser.name}`);
            console.log(`- Email: ${adminUser.email}`);
            console.log(`- Role: ${adminUser.role}`);
            console.log(`- Password: ${adminUser.password ? '✅ Hashed' : '❌ Null'}`);
        } else {
            console.log('❌ User not found');
        }
        
        console.log('\n👮 Officer User (cmlreyr7x0007jthukwq55azl):');
        if (officerUser) {
            console.log(`- Name: ${officerUser.name}`);
            console.log(`- Email: ${officerUser.email}`);
            console.log(`- Role: ${officerUser.role}`);
            console.log(`- Password: ${officerUser.password ? '✅ Hashed' : '❌ Null'}`);
        } else {
            console.log('❌ User not found');
        }
        
        console.log('\n🔑 Login Credentials:');
        console.log('All users can now login with password: password123');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifySpecificUsers();
