import { useEffect, useState } from 'react';
import type { Product } from '../services/productService';
import { getProducts } from '../services/productService';
import ProductCard from '../components/catalog/ProductCard';
import ProductFilters from '../components/catalog/ProductFilters';

const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (error) return <div className="container error-banner">{error}</div>;

    return (
        <div className="catalog-layout">
            <aside className="catalog-sidebar">
                <ProductFilters onFilterChange={(filters) => {
                    console.log('Filters changed', filters);
                }} />
            </aside>

            <div className="catalog-content">
                <div className="catalog-header">
                    <h1 className="catalog-title">Catalog</h1>
                    <span className="product-count">Showing {products.length} products</span>
                </div>

                {products.length === 0 ? (
                    <div className="glass-panel empty-state">
                        No products found.
                    </div>
                ) : (
                    <div className="catalog-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;
