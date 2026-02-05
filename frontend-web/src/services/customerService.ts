import axios from 'axios';
import { API_URL } from './config';


export interface Customer {
    id: number;
    name: string;
    company?: string;
    email: string;
    phone?: string;
    notes?: string;
    created_at: string;
}

export interface CustomerInput {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    notes?: string;
}

export const getCustomers = async () => {
    const response = await axios.get<Customer[]>(`${API_URL}/customers`);
    return response.data;
};

export const createCustomer = async (customer: CustomerInput) => {
    const response = await axios.post<Customer>(`${API_URL}/customers`, customer);
    return response.data;
};
