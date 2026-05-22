import { Request, Response } from 'express';
import { stripeService } from '../services/stripe.service';

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    console.error('[StripeWebhook] Missing stripe-signature header.');
    return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
  }

  try {
    // req.body is expected to be raw Buffer because of express.raw middleware on this route
    const rawBody = req.body;
    
    console.log('[StripeWebhook] Verifying signature and constructing Stripe event...');
    const event = stripeService.constructEvent(rawBody, signature as string);
    console.log(`[StripeWebhook] Validated Stripe Event: ${event.id} | Type: ${event.type}`);

    // Process event asynchronously
    stripeService.forwardWebhookEventToNest(event).catch(err => {
      console.error('[StripeWebhook] Background Nest API forwarding failed:', err);
    });

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error(`[StripeWebhook] Webhook signature verification failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
