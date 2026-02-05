import axios from 'axios';

const API_URL = 'http://localhost:4000/api/orders';

export interface Order {
    id: number;
    total_amount: string;
    status: string;
    created_at: string;
    customer_name: string;
}

export const getOrders = async (): Promise<Order[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const updateOrderStatus = async (id: number, status: string): Promise<Order> => {
    const response = await axios.patch(`${API_URL}/${id}/status`, { status });
    return response.data;
};

export const downloadInvoice = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}/invoice`, {
        responseType: 'blob' // Important for PDF download
    });

    // Create a Blob from the PDF Stream
    const file = new Blob(
        [response.data],
        { type: 'application/pdf' }
    );

    // Build a URL from the file
    const fileURL = URL.createObjectURL(file);

    // Open the URL on new Window
    const pdfWindow = window.open(fileURL);
    if (pdfWindow) {
        pdfWindow.focus();
    }
};
