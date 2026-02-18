import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Rate limiting storage (in production, use Redis)
const rateLimitStorage = new Map();

// Rate limiting: max 5 attempts per OTP per email
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = `verify-otp:${email}`;
  const attempts = rateLimitStorage.get(key) || [];

  // Remove old attempts (older than 10 minutes)
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < 10 * 60 * 1000);

  if (validAttempts.length >= 5) {
    return false; // Rate limited
  }

  validAttempts.push(now);
  rateLimitStorage.set(key, validAttempts);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        {
          error: 'Too many verification attempts. Please request a new OTP.',
          retryAfter: '10 minutes'
        },
        { status: 429 }
      );
    }

    // Get OTP from database
    const storedToken = await (prisma as any).passwordResetToken.findFirst({
      where: {
        email,
        token: otp.toString(),
      },
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > new Date(storedToken.expires)) {
      await (prisma as any).passwordResetToken.delete({
        where: { id: storedToken.id },
      });
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // OTP is valid — generate a reset token
    const resetToken = Buffer.from(`${email}:${storedToken.id}:${Date.now()}`).toString('base64');

    // Delete the used OTP token from DB (it's been verified)
    await (prisma as any).passwordResetToken.delete({
      where: { id: storedToken.id },
    });

    // Store reset token temporarily in memory (short-lived, 15 min)
    (global as any).resetTokenStorage = (global as any).resetTokenStorage || new Map();
    (global as any).resetTokenStorage.set(email, {
      resetToken,
      userId: (await prisma.user.findUnique({ where: { email } }))?.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    return NextResponse.json({
      message: 'OTP verified successfully',
      resetToken,
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
