"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environmental variables
dotenv_1.default.config();
// Fallback to workspace root .env if not found
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../.env') });
exports.config = {
    port: parseInt(process.env.NODE_SERVICES_PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    // Service-to-service Authentication
    internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026',
    // ImageKit Configuration
    imagekit: {
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY || '',
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/er7lmis3j',
    },
    // Email Configuration (Resend + SMTP Fallback)
    email: {
        resendApiKey: process.env.RESEND_API_KEY || '',
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.resend.com',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            user: process.env.SMTP_USER || process.env.SMTP_EMAIL || '',
            pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '',
            from: process.env.SMTP_FROM || 'JanSankalp Alerts <alerts@jansankalp.org>',
        }
    },
    // Stripe Configuration
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    }
};
