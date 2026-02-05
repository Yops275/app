import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
    const { items, removeFromCart, updateQuantity, getTotal } = useCartStore();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="empty-cart">
                <h2 className="summary-title">Your Cart is Empty</h2>
                <Link to="/catalog" className="btn-primary empty-cart-btn">Browse Catalog</Link>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h1 className="page-title cart-title">Shopping Cart</h1>

            <div className="glass-panel cart-panel">
                {items.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="item-info">
                            <h3 className="item-title">{item.name}</h3>
                            <p className="item-price-text">${item.price} each</p>
                        </div>

                        <div className="quantity-controls">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="qty-btn"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="qty-btn"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <div className="cart-footer">
                    <div className="cart-total-row">
                        <span className="cart-total-label">Total:</span>
                        <span className="cart-total-value">${getTotal().toFixed(2)}</span>
                    </div>
                </div>

                <div className="checkout-actions">
                    <button
                        onClick={handleCheckout}
                        className="btn-primary checkout-btn"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
