import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with secret key from env or a placeholder for dev
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-01-28.clover', // Matching the installed library type definition
});

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn('STRIPE_SECRET_KEY is not set. Using mock response.');
            // Return a mock intent for frontend testing if no key is present
            return res.json({
                clientSecret: 'mock_client_secret_for_testing',
                id: 'pi_mock_123456789'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};
