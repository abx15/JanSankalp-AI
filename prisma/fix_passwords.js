const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixExistingUsers() {
    console.log('🔧 Fixing existing users with null passwords...');

    // Helper function to hash password
    const hashPassword = async (password) => {
        return await bcrypt.hash(password, 12);
    };

    const defaultPassword = 'password123';
    const hashedPassword = await hashPassword(defaultPassword);

    try {
        // Update the specific admin user you mentioned
        const adminUpdate = await prisma.user.update({
            where: { id: 'cmlreyps60006jthuynyrn0t3' },
            data: {
                password: hashedPassword,
                emailVerified: new Date(),
            },
        });
        console.log(`✅ Updated admin: ${adminUpdate.name} (${adminUpdate.email})`);

        // Update the specific officer user you mentioned
        const officerUpdate = await prisma.user.update({
            where: { id: 'cmlreyr7x0007jthukwq55azl' },
            data: {
                password: hashedPassword,
                emailVerified: new Date(),
            },
        });
        console.log(`✅ Updated officer: ${officerUpdate.name} (${officerUpdate.email})`);

        // Check for any other users with null passwords
        const usersWithNullPassword = await prisma.user.findMany({
            where: { password: null },
        });

        console.log(`\n🔍 Found ${usersWithNullPassword.length} users with null passwords:`);

        for (const user of usersWithNullPassword) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    emailVerified: new Date(),
                },
            });
            console.log(`✅ Fixed: ${user.name} (${user.email}) - Role: ${user.role}`);
        }

        console.log('\n🎉 All user passwords have been fixed!');
        console.log(`\n🔑 Login Details:`);
        console.log(`Password for all accounts: ${defaultPassword}`);
        
        // Display all users with their roles
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            orderBy: { role: 'asc' }
        });

        console.log('\n📋 All Users:');
        allUsers.forEach(user => {
            console.log(`- ${user.role}: ${user.name} (${user.email})`);
        });

    } catch (error) {
        console.error('❌ Error fixing users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixExistingUsers();
