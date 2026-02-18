import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher';

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const verified = searchParams.get('verified');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      where.role = role;
    }

    if (verified === 'true') {
      where.emailVerified = { not: null };
    } else if (verified === 'false') {
      where.emailVerified = null;
    }

    // Get users with complaint count
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            complaints: true
          }
        }
      }
    });

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let updatedUser;

    switch (action) {
      case 'verify_email':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { emailVerified: new Date() }
        });
        break;

      case 'unverify_email':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { emailVerified: null }
        });
        break;

      case 'make_admin':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role: 'ADMIN' }
        });
        break;

      case 'make_officer':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role: 'OFFICER' }
        });
        break;

      case 'make_citizen':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role: 'CITIZEN' }
        });
        break;

      case 'delete':
        // Don't allow deletion of admins
        const userToDelete = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (userToDelete?.role === 'ADMIN') {
          return NextResponse.json(
            { error: 'Cannot delete admin users' },
            { status: 400 }
          );
        }

        await prisma.user.delete({
          where: { id: userId }
        });

        await pusherServer.trigger("governance-channel", "user-deleted", { userId });

        return NextResponse.json({
          message: 'User deleted successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Trigger real-time update for other admins
    await pusherServer.trigger("governance-channel", "user-updated", { userId });

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
