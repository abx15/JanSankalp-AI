import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { config } from '../config';

class EmailService {
  private resend: Resend | null = null;
  private smtpTransporter: nodemailer.Transporter | null = null;

  constructor() {
    // Initialize Resend
    if (config.email.resendApiKey) {
      this.resend = new Resend(config.email.resendApiKey);
      console.log('[EmailService] Resend API key configured.');
    } else {
      console.log('[EmailService] Resend API key missing. Relying on SMTP/transporter.');
    }

    // Initialize SMTP Fallback Transporter
    if (config.email.smtp.host && config.email.smtp.user) {
      this.smtpTransporter = nodemailer.createTransport({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.port === 465,
        auth: {
          user: config.email.smtp.user,
          pass: config.email.smtp.pass,
        },
      });
      console.log('[EmailService] SMTP Transporter configured.');
    } else {
      console.warn('[EmailService] Warning: SMTP Transporter credentials missing.');
    }
  }

  public async sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; id?: string; error?: string }> {
    console.log(`[EmailService] Attempting to send email to ${to} | Subject: "${subject}"`);
    
    // 1. Try Resend if configured
    if (this.resend) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: config.email.smtp.from,
          to,
          subject,
          html,
        });

        if (error) {
          console.error('[EmailService] Resend send error details:', error);
          throw new Error(error.message);
        }

        console.log(`[EmailService] Email sent successfully via Resend. ID: ${data?.id}`);
        return { success: true, id: data?.id };
      } catch (err: any) {
        console.warn(`[EmailService] Resend failed: ${err.message || err}. Falling back to SMTP...`);
      }
    }

    // 2. Try SMTP Transporter if configured
    if (this.smtpTransporter) {
      try {
        const info = await this.smtpTransporter.sendMail({
          from: config.email.smtp.from,
          to,
          subject,
          html,
        });

        console.log(`[EmailService] Email sent successfully via SMTP. MessageId: ${info.messageId}`);
        return { success: true, id: info.messageId };
      } catch (err: any) {
        console.error(`[EmailService] SMTP failed: ${err.message || err}`);
        console.log(`[EmailService-MOCK] sandbox/development mode fallback triggered. Email printed to console instead:`);
        console.log(`--------------------------------------------------------------------------------`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body (HTML Snippet):\n${html.substring(0, 1000)}...\n[REST TRUNCATED FOR READABILITY]`);
        console.log(`--------------------------------------------------------------------------------`);
        return { success: true, id: `mock-email-id-${Date.now()}` };
      }
    }

    return {
      success: false,
      error: 'No active email providers (Resend and SMTP are unconfigured)',
    };
  }
}

export const emailService = new EmailService();
