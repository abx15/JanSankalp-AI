"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationEmail = void 0;
const email_service_1 = require("../services/email.service");
const redis_service_1 = require("../services/redis.service");
const sendNotificationEmail = async (req, res, next) => {
    try {
        const { to, subject, html, userId } = req.body;
        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters: to, subject, and html are required.',
            });
        }
        const result = await email_service_1.emailService.sendEmail(to, subject, html);
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send email notification.',
                error: result.error,
            });
        }
        // If userId is provided, publish real-time notification to Redis
        if (userId) {
            (0, redis_service_1.publishEvent)(`user-${userId}`, 'notification', {
                title: subject,
                message: 'Notification email successfully dispatched.',
                type: 'EMAIL_SENT',
                timestamp: new Date().toISOString(),
            }).catch(err => {
                console.error('[Redis Pub] Failed to publish notification event:', err);
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Email notification sent successfully.',
            messageId: result.id,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.sendNotificationEmail = sendNotificationEmail;
