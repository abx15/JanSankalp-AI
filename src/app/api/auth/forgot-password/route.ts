import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOTPEmail } from '@/lib/email-service';
import crypto from 'crypto';

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // User doesn't exist, tell them to register first
      return NextResponse.json(
        { 
          error: 'No account found with this email address',
          suggestion: 'Please register an account first',
          needsRegistration: true
        },
        { status: 404 }
      );
    }

    // Generate OTP and expiry (10 minutes)
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database (you might want to create a separate table for this)
    // For now, we'll store it in the user table with a new field
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // Note: You'll need to add these fields to your User model
        // For now, we'll use a simple approach
      },
    });

    // Store OTP in memory or use Redis for production
    // For this example, we'll use a simple approach with database
    // In production, consider using Redis or a separate OTP table
    
    // Create a temporary OTP storage (you should create a proper OTP table)
    const otpData = {
      userId: user.id,
      otp,
      expiresAt,
      email,
    };

    // For now, let's create a simple file-based storage or use session
    // In production, use Redis or database table
    console.log('🔑 OTP Generated for', email, ':', otp); // For development only
    console.log('⏰ OTP Expires at:', expiresAt);

    // Send OTP email
    console.log('📧 Sending OTP email to:', email);
    const emailResult = await sendOTPEmail(email, user.name || 'User', otp);

    if (!emailResult.success) {
      console.error("❌ Email sending error:", emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send OTP email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('✅ OTP email sent successfully to:', email);

    // Store OTP in a temporary storage (in production, use Redis or database)
    // For now, we'll use a simple approach with a global variable (not recommended for production)
    (global as any).otpStorage = (global as any).otpStorage || new Map();
    (global as any).otpStorage.set(email, {
      otp,
      expiresAt,
      userId: user.id,
    });

    return NextResponse.json({
      message: 'OTP sent to your email successfully',
      // For development only, remove in production
      debug: process.env.NODE_ENV === 'development' ? { otp } : undefined,
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
