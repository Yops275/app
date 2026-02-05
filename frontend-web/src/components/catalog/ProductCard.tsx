import React from 'react';
import type { Product } from '../../services/productService';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const addToCart = useCartStore((state) => state.addToCart);
    return (
        <div className="glass-panel product-card">
            <div className="card-image-container">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="card-image" />
                ) : (
                    <span className="card-image-placeholder">No Image</span>
                )}
            </div>
            <div className="card-content">
                <div className="card-body-content">
                    <span className="card-category">{product.category}</span>
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-description">
                        {product.description}
                    </p>
                </div>

                <div className="card-actions">
                    <span className="card-price">${product.price}</span>
                    <button
                        className="btn-primary card-btn"
                        onClick={() => addToCart(product, 1)}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
