import express, { Router } from 'express';
import { handleStripeWebhook } from '../controllers/payment.controller';

const router = Router();

// Stripe webhook endpoint - parses raw request body as Buffer to verify signature
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

export default router;
