import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email, testOTP } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Use provided test OTP or generate a new one
    const otp = testOTP || Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('🧪 Testing email service with OTP:', otp);
    
    const emailResult = await sendOTPEmail(email, 'Test User', otp);

    if (!emailResult.success) {
      console.error("❌ Email test failed:", emailResult.error);
      return NextResponse.json(
        { 
          error: 'Email test failed',
          details: emailResult.error,
          otp: otp // Show OTP for testing
        },
        { status: 500 }
      );
    }

    console.log('✅ Email test successful for:', email);

    return NextResponse.json({
      message: 'Test email sent successfully',
      otp: otp,
      email: email,
      details: 'Check your email inbox (and spam folder)'
    });

  } catch (error) {
    console.error('🧪 Email test error:', error);
    return NextResponse.json(
      { error: 'Test failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
