import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useCartStore } from '../../store/useCartStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { clearCart, getTotal, items } = useCartStore();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Create Order in Backend
            try {
                // NOTE: In a real app, you'd want to verify the webhook instead of trusting the client
                // But for this demo we'll create the order here
                await axios.post('http://localhost:4000/api/orders', {
                    customerId: 1, // Hardcoded for demo
                    totalAmount: getTotal(),
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });

                clearCart();
                navigate('/orders');
            } catch (err) {
                setErrorMessage('Payment succeeded but order creation failed.');
            }
            setIsProcessing(false);
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {errorMessage && <div className="auth-error">{errorMessage}</div>}
            <button
                disabled={isProcessing || !stripe || !elements}
                className="btn-primary payment-submit-btn"
            >
                {isProcessing ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
            </button>
        </form>
    );
};

export default PaymentForm;
