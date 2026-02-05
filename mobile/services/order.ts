import axios from 'axios';
import { AuthService } from './auth';

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    customer_id: number;
    total_amount: string | number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    created_at: string;
    items?: OrderItem[];
    customer_name?: string; // Often joined in backend
}

export const OrderService = {
    getAllOrders: async (): Promise<Order[]> => {
        try {
            const token = await AuthService.getToken();
            const response = await axios.get(`${AuthService.API_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders', error);
            throw error;
        }
    },

    getOrderById: async (id: number): Promise<Order> => {
        try {
            const token = await AuthService.getToken();
            const response = await axios.get(`${AuthService.API_URL}/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching order ${id}`, error);
            throw error;
        }
    }
};
