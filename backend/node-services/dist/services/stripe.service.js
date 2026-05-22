"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../config");
class StripeService {
    stripe = null;
    constructor() {
        if (config_1.config.stripe.secretKey) {
            this.stripe = new stripe_1.default(config_1.config.stripe.secretKey, {
                apiVersion: '2024-04-10', // Standard stable API version
            });
            console.log('[StripeService] Stripe initialized successfully.');
        }
        else {
            console.warn('[StripeService] Warning: Stripe secret key missing. Payment operations will fail.');
        }
    }
    getStripeInstance() {
        if (!this.stripe) {
            throw new Error('Stripe client is not initialized due to missing secret key');
        }
        return this.stripe;
    }
    constructEvent(rawBody, signature) {
        const stripeInstance = this.getStripeInstance();
        return stripeInstance.webhooks.constructEvent(rawBody, signature, config_1.config.stripe.webhookSecret);
    }
    async forwardWebhookEventToNest(event) {
        const nestApiUrl = process.env.NEST_API_INTERNAL_URL || 'http://nest-api:3000';
        console.log(`[StripeService] Forwarding Stripe event "${event.type}" to NestAPI: ${nestApiUrl}/api/payments/webhook`);
        try {
            const response = await fetch(`${nestApiUrl}/api/payments/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config_1.config.internalServiceToken}`
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
        }
        catch (err) {
            console.error(`[StripeService] Failed to forward Stripe event to NestAPI: ${err.message}`);
            return false;
        }
    }
}
exports.stripeService = new StripeService();
