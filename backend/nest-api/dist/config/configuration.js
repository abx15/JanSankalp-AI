"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    database: {
        url: process.env.DATABASE_URL,
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
    jwt: {
        secret: process.env.AUTH_SECRET || 'your-default-nestauth-jwt-secret-key-super-secure',
        expiresIn: '15m',
        refreshExpiresIn: '7d',
    },
    aiService: {
        url: process.env.AI_SERVICE_URL || 'http://localhost:8000',
        secretToken: process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026',
    },
    pusher: {
        appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || process.env.PUSHER_APP_ID,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    },
    smtp: {
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD,
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
    },
});
//# sourceMappingURL=configuration.js.map