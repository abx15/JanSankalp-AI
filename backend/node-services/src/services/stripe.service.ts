import Stripe from 'stripe';
import { config } from '../config';

class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    if (config.stripe.secretKey) {
      this.stripe = new Stripe(config.stripe.secretKey, {
        apiVersion: '2024-04-10' as any, // Standard stable API version
      });
      console.log('[StripeService] Stripe initialized successfully.');
    } else {
      console.warn('[StripeService] Warning: Stripe secret key missing. Payment operations will fail.');
    }
  }

  public getStripeInstance(): Stripe {
    if (!this.stripe) {
      throw new Error('Stripe client is not initialized due to missing secret key');
    }
    return this.stripe;
  }

  public constructEvent(rawBody: string | Buffer, signature: string): Stripe.Event {
    const stripeInstance = this.getStripeInstance();
    return stripeInstance.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret
    );
  }

  public async forwardWebhookEventToNest(event: Stripe.Event): Promise<boolean> {
    const nestApiUrl = process.env.NEST_API_INTERNAL_URL || 'http://nest-api:3000';
    console.log(`[StripeService] Forwarding Stripe event "${event.type}" to NestAPI: ${nestApiUrl}/api/payments/webhook`);
    
    try {
      const response = await fetch(`${nestApiUrl}/api/payments/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.internalServiceToken}`
        },
        body: JSON.stringify(event)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[StripeService] NestAPI callback failed with status ${response.status}: ${errorText}`);
        return false;
      }
      
      console.log(`[StripeService] NestAPI successfully processed Stripe event.`);
      return true;
    } catch (err: any) {
      console.error(`[StripeService] Failed to forward Stripe event to NestAPI: ${err.message}`);
      return false;
    }
  }
}

export const stripeService = new StripeService();
