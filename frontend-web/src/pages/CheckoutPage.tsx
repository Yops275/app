import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/checkout/PaymentForm';
import { useCartStore } from '../store/useCartStore';
import axios from 'axios';

// Placeholder key - user needs to replace this in .env (but exposed here for demo structure)
// In real app use process.env.VITE_STRIPE_KEY
const stripePromise = loadStripe('pk_test_placeholder');

const CheckoutPage = () => {
    const { getTotal, items } = useCartStore();
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (items.length > 0) {
            // Create PaymentIntent as soon as the page loads
            axios.post('http://localhost:4000/api/payments/create-intent', {
                amount: getTotal(),
                currency: 'usd'
            })
                .then(res => setClientSecret(res.data.clientSecret))
                .catch(err => console.error('Failed to init payment', err));
        }
    }, [items, getTotal]);

    if (items.length === 0) {
        return <div className="container empty-state">Your cart is empty.</div>;
    }

    return (
        <div className="container checkout-page">
            <h1 className="page-title checkout-title">Checkout</h1>

            <div className="glass-panel checkout-panel">
                <div className="order-summary">
                    <h2 className="summary-title">Order Summary</h2>
                    <div className="summary-row">
                        <span>Total</span>
                        <span>${getTotal().toFixed(2)}</span>
                    </div>
                </div>

                {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                        <PaymentForm />
                    </Elements>
                ) : (
                    <div className="payment-loading">
                        Initializing secure payment...
                    </div>
                )}
            </div>

            <p className="payment-note">
                Note: This is a demo integration. You need to provide valid Stripe API keys in the backend and frontend configuration for this to work.
            </p>
        </div>
    );
};

export default CheckoutPage;
