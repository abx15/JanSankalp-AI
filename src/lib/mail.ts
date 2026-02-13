import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "JanSankalp <onboarding@resend.dev>", // Or your verified domain
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
};
