import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"JanSankalp AI" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Verify your email - JanSankalp AI",
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Verify your email</h2>
            <p style="color: #64748b;">Welcome to JanSankalp AI. Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 1 hour.</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #3b82f6;">${token}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `,
    });

    console.log("✅ Verification email sent successfully to:", email);
    console.log(`🔑 [DEV ONLY] VERIFICATION OTP for ${email}: ${token}`);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Verification Email Service Error:", error);
    // Log OTP anyway so dev can continue
    console.log(`🔑 [FALLBACK] VERIFICATION OTP for ${email}: ${token}`);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"JanSankalp AI" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Reset your password - JanSankalp AI",
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Reset your password</h2>
            <p style="color: #64748b;">You requested a password reset. Please use the following One-Time Password (OTP) to proceed. This code is valid for 10 minutes.</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
              <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #ef4444;">${token}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
        `,
    });

    console.log("✅ Password reset email sent successfully to:", email);
    console.log(`🔑 [DEV ONLY] PASSWORD RESET OTP for ${email}: ${token}`);
    return { success: true, data: info };
  } catch (error) {
    console.error("❌ Password Reset Email Service Error:", error);
    // Log OTP anyway so dev can continue
    console.log(`🔑 [FALLBACK] PASSWORD RESET OTP for ${email}: ${token}`);
    return { success: false, error };
  }
};
