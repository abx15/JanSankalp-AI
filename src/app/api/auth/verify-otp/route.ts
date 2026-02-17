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

    console.log('🔍 Verifying OTP for email:', email);
    console.log('🔍 Entered OTP:', otp);
    console.log('🔍 Stored OTP Data:', storedOTPData ? 'Found' : 'Not found');

    if (!storedOTPData) {
      console.log('❌ No OTP data found for email:', email);
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > storedOTPData.expiresAt) {
      console.log('❌ OTP expired for email:', email);
      (global as any).otpStorage.delete(email);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOTPData.otp !== otp.toString()) {
      console.log('❌ OTP mismatch. Expected:', storedOTPData.otp, 'Got:', otp);
      return NextResponse.json(
        { error: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    console.log('✅ OTP verified successfully for email:', email);

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
