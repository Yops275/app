import axios from 'axios';
import { AuthService } from './auth';
import { API_URL } from './config';


export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku: string;
    category: string;
    image_url?: string;
    barcode?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
}

export const ProductService = {
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const token = await AuthService.getToken();
            const response = await axios.get(`${API_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products', error);
            throw error;
        }
    },

    getProductById: async (id: string): Promise<Product> => {
        try {
            const token = await AuthService.getToken();
            const response = await axios.get(`${API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}`, error);
            throw error;
        }
    },

    getProductByBarcode: async (barcode: string): Promise<Product | null> => {
        try {
            const token = await AuthService.getToken();
            // Assuming backend supports filter or we fetch all and find (for MVP)
            // Ideally: GET /products?barcode=...
            const response = await axios.get(`${API_URL}/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const products: Product[] = response.data;
            const found = products.find(p => p.barcode === barcode || p.sku === barcode);

            return found || null;
        } catch (error) {
            console.error(`Error searching barcode ${barcode}`, error);
            throw error;
        }
    }
};
