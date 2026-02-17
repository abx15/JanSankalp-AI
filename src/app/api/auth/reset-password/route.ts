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

    // Get OTP data from temporary storage
    global.otpStorage = global.otpStorage || new Map();
    const storedOTPData = global.otpStorage.get(email);

    if (!storedOTPData || !storedOTPData.verified || storedOTPData.resetToken !== resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if OTP has expired (extra security)
    if (new Date() > storedOTPData.expiresAt) {
      global.otpStorage.delete(email);
      return NextResponse.json(
        { error: 'Reset token has expired. Please start over' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    const updatedUser = await prisma.user.update({
      where: { id: storedOTPData.userId },
      data: { password: hashedPassword },
    });

    // Clean up OTP data
    global.otpStorage.delete(email);

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
