"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const stripe_service_1 = require("../services/stripe.service");
const handleStripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        console.error('[StripeWebhook] Missing stripe-signature header.');
        return res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
    }
    try {
        // req.body is expected to be raw Buffer because of express.raw middleware on this route
        const rawBody = req.body;
        console.log('[StripeWebhook] Verifying signature and constructing Stripe event...');
        const event = stripe_service_1.stripeService.constructEvent(rawBody, signature);
        console.log(`[StripeWebhook] Validated Stripe Event: ${event.id} | Type: ${event.type}`);
        // Process event asynchronously
        stripe_service_1.stripeService.forwardWebhookEventToNest(event).catch(err => {
            console.error('[StripeWebhook] Background Nest API forwarding failed:', err);
        });
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error(`[StripeWebhook] Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};
exports.handleStripeWebhook = handleStripeWebhook;
