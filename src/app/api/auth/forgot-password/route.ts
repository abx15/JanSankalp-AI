import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

// Rate limiting storage (in production, use Redis)
const rateLimitStorage = new Map();

// Rate limiting: max 3 requests per 15 minutes per email
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = `forgot-password:${email}`;
  const attempts = rateLimitStorage.get(key) || [];

  // Remove old attempts (older than 15 minutes)
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < 15 * 60 * 1000);

  if (validAttempts.length >= 3) {
    return false; // Rate limited
  }

  validAttempts.push(now);
  rateLimitStorage.set(key, validAttempts);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again after 15 minutes.',
          retryAfter: '15 minutes'
        },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'No account found with this email address',
          suggestion: 'Please register an account first',
          needsRegistration: true
        },
        { status: 404 }
      );
    }

    // Generate OTP and store in database (10 minutes expiry)
    const { token } = await generatePasswordResetToken(email);

    console.log('🔑 OTP Generated and stored in DB for:', email);

    // Send OTP email
    console.log('📧 Sending OTP email to:', email);
    const emailResult = await sendPasswordResetEmail(email, token);

    if (!emailResult.success) {
      console.error("❌ Email sending error:", emailResult.error);
      // In development, still allow proceeding since OTP is logged to console
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔑 [DEV] Use this OTP to reset password for ${email}: ${token}`);
        return NextResponse.json({
          message: 'OTP sent (check server console in dev mode)',
          debug: { otp: token }
        });
      }
      return NextResponse.json(
        {
          error: 'Failed to send OTP email. Please try again later.',
          details: 'Email service temporarily unavailable'
        },
        { status: 500 }
      );
    }

    console.log('✅ OTP email sent successfully to:', email);

    return NextResponse.json({
      message: 'OTP sent to your email successfully',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
