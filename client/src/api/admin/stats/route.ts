import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get overall statistics
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const totalOfficers = await prisma.user.count({ where: { role: 'OFFICER' } });
    const totalCitizens = await prisma.user.count({ where: { role: 'CITIZEN' } });
    const verifiedUsers = await prisma.user.count({ where: { emailVerified: { not: null } } });
    const unverifiedUsers = await prisma.user.count({ where: { emailVerified: null } });
    
    // Complaint stats
    const totalComplaints = await prisma.complaint.count();
    const pendingComplaints = await prisma.complaint.count({ where: { status: 'PENDING' } });
    const inProgressComplaints = await prisma.complaint.count({ where: { status: 'IN_PROGRESS' } });
    const resolvedComplaints = await prisma.complaint.count({ where: { status: 'RESOLVED' } });
    const rejectedComplaints = await prisma.complaint.count({ where: { status: 'REJECTED' } });
    
    // Activity stats
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogins = await prisma.auditLog.count({
      where: {
        action: 'USER_LOGIN',
        createdAt: { gte: twentyFourHoursAgo }
      }
    });
    
    const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: { gte: thisMonthStart }
      }
    });
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsersLast7Days = await prisma.auditLog.count({
      where: {
        action: { in: ['USER_LOGIN', 'COMPLAINT_CREATED', 'COMPLAINT_RESOLVED'] },
        createdAt: { gte: sevenDaysAgo }
      }
    });

    // Get department stats
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            complaints: true
          }
        }
      }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        totalAdmins,
        totalOfficers,
        totalCitizens,
        verifiedUsers,
        unverifiedUsers,
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        recentLogins,
        newUsersThisMonth,
        activeUsersLast7Days
      },
      departments: departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        complaintsCount: dept._count.complaints,
        head: dept.headId
      }))
    });

  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
