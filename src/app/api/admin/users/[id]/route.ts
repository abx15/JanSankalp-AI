import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            complaints: true,
            assignedTasks: true
          }
        },
        complaints: {
          select: {
            id: true,
            ticketId: true,
            title: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Don't allow admin to modify themselves
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    // Check if target user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't allow deleting other admins
    if (existingUser.role === "ADMIN" && body.action === "delete") {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 400 }
      );
    }

    let updatedUser;

    switch (body.action) {
      case 'block':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { 
            emailVerified: null,
            // You could add a 'blocked' field to the schema
            // blocked: true 
          }
        });
        break;

      case 'unblock':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { 
            emailVerified: new Date()
          }
        });
        break;

      case 'verify_email':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { emailVerified: new Date() }
        });
        break;

      case 'unverify_email':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { emailVerified: null }
        });
        break;

      case 'make_admin':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { role: 'ADMIN' }
        });
        break;

      case 'make_officer':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { role: 'OFFICER' }
        });
        break;

      case 'make_citizen':
        updatedUser = await prisma.user.update({
          where: { id },
          data: { role: 'CITIZEN' }
        });
        break;

      case 'update_profile':
        const { name, phone, address, points } = body;
        updatedUser = await prisma.user.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(points !== undefined && { points: parseInt(points) })
          }
        });
        break;

      case 'delete':
        // Don't allow deletion of admins
        if (existingUser.role === 'ADMIN') {
          return NextResponse.json(
            { error: 'Cannot delete admin users' },
            { status: 400 }
          );
        }

        await prisma.user.delete({
          where: { id }
        });

        return NextResponse.json({
          message: 'User deleted successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

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
