"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Stripe with secret key from env or a placeholder for dev
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2026-01-28.clover', // Matching the installed library type definition
});
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const paymentIntent = yield stripe.paymentIntents.create({
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
    }
    catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
});
exports.createPaymentIntent = createPaymentIntent;
