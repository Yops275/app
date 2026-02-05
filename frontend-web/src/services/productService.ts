import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    material?: string;
    price: number;
    image_url?: string;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit: string;
    };
    stock: number;
}

export const getProducts = async (params?: { category?: string; minPrice?: number; maxPrice?: number }) => {
    const response = await axios.get<Product[]>(`${API_URL}/products`, { params });
    return response.data;
};

export const getProductById = async (id: number) => {
    const response = await axios.get<Product>(`${API_URL}/products/${id}`);
    return response.data;
};
