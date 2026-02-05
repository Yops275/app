import { render, screen } from '@testing-library/react';
import ProductCard from '../components/catalog/ProductCard';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const mockProduct = {
    id: 1,
    name: "Test Box",
    description: "A test box",
    category: "Box",
    material: "Cardboard",
    dimensions: { length: 10, width: 10, height: 10, unit: "cm" },
    price: 5.00,
    stock: 100,
    image_url: "http://example.com/image.jpg",
    created_at: new Date().toISOString()
};

describe('ProductCard', () => {
    it('renders product information correctly', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        expect(screen.getByText("Test Box")).toBeInTheDocument();
        // The component renders "$" and price joined. 
        // We use getAllByText because pure text match might find the parent div too.
        const priceElements = screen.getAllByText((_, element) => {
            return element?.tagName.toLowerCase() === 'span' && element?.textContent?.includes("$5");
        });
        expect(priceElements.length).toBeGreaterThan(0);
    });
});
