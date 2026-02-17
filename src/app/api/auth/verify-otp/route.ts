import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Get OTP from temporary storage
    (global as any).otpStorage = (global as any).otpStorage || new Map();
    const storedOTPData = (global as any).otpStorage.get(email);

    if (!storedOTPData) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > storedOTPData.expiresAt) {
      (global as any).otpStorage.delete(email);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOTPData.otp !== otp.toString()) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP is valid, generate a reset token
    const resetToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    // Mark OTP as verified
    storedOTPData.verified = true;
    storedOTPData.resetToken = resetToken;
    (global as any).otpStorage.set(email, storedOTPData);

    return NextResponse.json({
      message: 'OTP verified successfully',
      resetToken,
      userId: storedOTPData.userId,
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
