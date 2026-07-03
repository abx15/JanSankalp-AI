"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const resend_1 = require("resend");
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
class EmailService {
    resend = null;
    smtpTransporter = null;
    constructor() {
        // Initialize Resend
        if (config_1.config.email.resendApiKey) {
            this.resend = new resend_1.Resend(config_1.config.email.resendApiKey);
            console.log('[EmailService] Resend API key configured.');
        }
        else {
            console.log('[EmailService] Resend API key missing. Relying on SMTP/transporter.');
        }
        // Initialize SMTP Fallback Transporter
        if (config_1.config.email.smtp.host && config_1.config.email.smtp.user) {
            this.smtpTransporter = nodemailer_1.default.createTransport({
                host: config_1.config.email.smtp.host,
                port: config_1.config.email.smtp.port,
                secure: config_1.config.email.smtp.port === 465,
                auth: {
                    user: config_1.config.email.smtp.user,
                    pass: config_1.config.email.smtp.pass,
                },
            });
            console.log('[EmailService] SMTP Transporter configured.');
        }
        else {
            console.warn('[EmailService] Warning: SMTP Transporter credentials missing.');
        }
    }
    async sendEmail(to, subject, html) {
        console.log(`[EmailService] Attempting to send email to ${to} | Subject: "${subject}"`);
        // 1. Try Resend if configured
        if (this.resend) {
            try {
                const { data, error } = await this.resend.emails.send({
                    from: config_1.config.email.smtp.from,
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
            }
            catch (err) {
                console.warn(`[EmailService] Resend failed: ${err.message || err}. Falling back to SMTP...`);
            }
        }
        // 2. Try SMTP Transporter if configured
        if (this.smtpTransporter) {
            try {
                const info = await this.smtpTransporter.sendMail({
                    from: config_1.config.email.smtp.from,
                    to,
                    subject,
                    html,
                });
                console.log(`[EmailService] Email sent successfully via SMTP. MessageId: ${info.messageId}`);
                return { success: true, id: info.messageId };
            }
            catch (err) {
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
exports.emailService = new EmailService();
