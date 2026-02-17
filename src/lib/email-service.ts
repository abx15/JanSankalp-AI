import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Add function to send OTP email
export async function sendOTPEmail(
  email: string,
  name: string,
  otp: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'JanSankalp AI <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Reset OTP - JanSankalp AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1e3a8a; text-transform: uppercase; letter-spacing: 2px; margin: 0;">JanSankalp AI</h1>
            <p style="color: #64748b; margin: 5px 0;">Governance Portal</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Password Reset Code</p>
            <div style="margin: 20px 0; font-size: 36px; font-weight: 900; letter-spacing: 8px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; display: inline-block;">
              ${otp}
            </div>
            <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">This code expires in 10 minutes</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; color: #475569;">Hello <strong>${name || 'User'}</strong>,</p>
            <p style="margin: 10px 0; font-size: 14px; color: #475569;">You requested to reset your password. Use the OTP code above to proceed with creating a new password.</p>
            
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="margin: 0; font-size: 13px; color: #991b1b; font-weight: 600;">
                🔒 Security Notice:
              </p>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 12px; color: #991b1b;">
                <li>Never share this OTP with anyone</li>
                <li>Our team will never ask for your OTP</li>
                <li>If you didn't request this, please ignore this email</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              This is an automated message from JanSankalp AI Governance Portal.<br>
              © 2024 JanSankalp AI. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend OTP Email Error:", error);
      return { success: false, error };
    }

    console.log("OTP email sent successfully to:", email);
    return { success: true, data };
  } catch (error) {
    console.error("OTP Email Service Error:", error);
    return { success: false, error };
  }
}

export async function sendComplaintConfirmationEmail(
  email: string,
  name: string,
  ticketId: string,
  category: string,
  location: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'JanSankalp AI <onboarding@resend.dev>', // Change to verified domain in production
      to: [email],
      subject: `Your Complaint Has Been Registered – ${ticketId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h1 style="color: #1e3a8a; text-transform: uppercase; letter-spacing: 2px;">JanSankalp AI</h1>
          <p style="font-size: 16px; color: #475569;">Namaste <strong>${name}</strong>,</p>
          <p style="font-size: 14px; color: #475569;">Your civic grievance has been successfully registered in our AI Hub.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">Ticket ID</p>
            <p style="margin: 5px 0 15px 0; font-size: 20px; font-weight: 900; color: #0f172a;">${ticketId}</p>
            
            <p style="margin: 0; font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">Category</p>
            <p style="margin: 5px 0 15px 0; font-size: 14px; font-weight: 600;">${category}</p>
            
            <p style="margin: 0; font-size: 12px; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">Location</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600;">${location}</p>
          </div>
          
          <p style="font-size: 14px; color: #475569;">You can track the live status of your complaint on our dashboard using the button below.</p>
          
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 99px; font-weight: 800; font-size: 12px; text-transform: uppercase; margin-top: 20px;">Track Live Updates</a>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 10px; color: #94a3b8; text-align: center;">This is an automated message from JanSankalp AI Governance Portal.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email Service Error:", error);
    return { success: false, error };
  }
}

export async function sendStatusUpdateEmail(
  email: string,
  name: string,
  ticketId: string,
  status: string,
  title: string
) {
  try {
    const statusColors: any = {
      'IN_PROGRESS': '#3b82f6',
      'RESOLVED': '#22c55e',
      'REJECTED': '#ef4444',
      'PENDING': '#f59e0b'
    };

    const statusLabel: any = {
      'IN_PROGRESS': 'In Progress',
      'RESOLVED': 'Resolved',
      'REJECTED': 'Rejected',
      'PENDING': 'Pending'
    };

    const color = statusColors[status] || '#1e3a8a';

    const { data, error } = await resend.emails.send({
      from: 'JanSankalp AI <onboarding@resend.dev>',
      to: [email],
      subject: `Update on your Report – ${ticketId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h1 style="color: #1e3a8a; text-transform: uppercase; letter-spacing: 2px;">JanSankalp AI</h1>
          <p style="font-size: 16px; color: #475569;">Namaste <strong>${name}</strong>,</p>
          <p style="font-size: 14px; color: #475569;">There has been an update to your civic report.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${color};">
            <p style="margin: 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Ticket ID</p>
            <p style="margin: 5px 0 15px 0; font-size: 18px; font-weight: 900; color: #0f172a;">${ticketId}</p>
            
            <p style="margin: 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">New Status</p>
            <p style="margin: 5px 0 15px 0; font-size: 16px; font-weight: 900; color: ${color};">${statusLabel[status] || status}</p>
            
            <p style="margin: 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Report Title</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600;">${title}</p>
          </div>
          
          <p style="font-size: 14px; color: #475569;">Our officers are working to ensure a swift resolution. You can view more details on your personal dashboard.</p>
          
          <a href="${process.env.NEXTAUTH_URL}/dashboard/my-reports" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 99px; font-weight: 800; font-size: 12px; text-transform: uppercase; margin-top: 20px;">View Report History</a>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 10px; color: #94a3b8; text-align: center;">This is an automated message from JanSankalp AI Governance Portal.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Status Email Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Status Email Service Error:", error);
    return { success: false, error };
  }
}
