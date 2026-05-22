import { Router } from 'express';
import { sendNotificationEmail } from '../controllers/email.controller';
import { verifyInternalToken } from '../middleware/auth';

const router = Router();

// Protected endpoint for internal email notifications dispatch
router.post('/send', verifyInternalToken, sendNotificationEmail);

export default router;
