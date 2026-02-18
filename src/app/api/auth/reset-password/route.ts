import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, resetToken, newPassword } = await request.json();

    if (!email || !resetToken || !newPassword) {
      return NextResponse.json(
        { error: 'Email, reset token, and new password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Get reset token from temporary storage
    (global as any).resetTokenStorage = (global as any).resetTokenStorage || new Map();
    const storedResetData = (global as any).resetTokenStorage.get(email);

    if (!storedResetData || storedResetData.resetToken !== resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please verify your OTP again.' },
        { status: 400 }
      );
    }

    // Check if reset token has expired (15 minutes)
    if (new Date() > storedResetData.expiresAt) {
      (global as any).resetTokenStorage.delete(email);
      return NextResponse.json(
        { error: 'Reset session has expired. Please start over.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Clean up reset token
    (global as any).resetTokenStorage.delete(email);

    console.log('✅ Password reset successfully for:', email);

    return NextResponse.json({
      message: 'Password reset successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
