import { Request, Response, NextFunction } from 'express';
import { emailService } from '../services/email.service';

export const sendNotificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: to, subject, and html are required.',
      });
    }

    const result = await emailService.sendEmail(to, subject, html);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email notification.',
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email notification sent successfully.',
      messageId: result.id,
    });
  } catch (error) {
    return next(error);
  }
};
