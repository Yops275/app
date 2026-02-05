import { useEffect, useState } from 'react';
import { Package, Download, RefreshCw } from 'lucide-react';
import { getOrders, updateOrderStatus, downloadInvoice, type Order } from '../services/orderService';

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateOrderStatus(id, newStatus);
            fetchOrders(); // Refresh list
        } catch (error) {
            alert('Failed to update status');
            console.error(error);
        }
    };

    const handleDownload = async (id: number) => {
        try {
            await downloadInvoice(id);
        } catch (error) {
            alert('Failed to download invoice');
            console.error(error);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    const statusColors: Record<string, string> = {
        pending: '#facc15',
        paid: '#60a5fa',
        shipped: '#a78bfa',
        delivered: '#4ade80',
        cancelled: '#ef4444',
        returned: '#f472b6'
    };

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title orders-page-title">Order Management</h1>
                <button
                    onClick={fetchOrders}
                    className="refresh-btn"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="glass-panel">
                <table className="orders-table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th">Order ID</th>
                            <th className="table-th">Customer</th>
                            <th className="table-th">Status</th>
                            <th className="table-th">Total</th>
                            <th className="table-th">Date</th>
                            <th className="table-th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="table-row">
                                <td className="table-td">
                                    <div className="order-id">
                                        <Package size={16} color="#6366f1" />
                                        <span className="order-id-text">#{order.id}</span>
                                    </div>
                                </td>
                                <td className="table-td">{order.customer_name || 'Guest'}</td>
                                <td className="table-td">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                        style={{
                                            border: `1px solid ${statusColors[order.status] || '#ccc'}`,
                                            color: statusColors[order.status] || '#ccc',
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="returned">Returned</option>
                                    </select>
                                </td>
                                <td className="table-td table-cell-bold">${parseFloat(order.total_amount).toFixed(2)}</td>
                                <td className="table-td table-cell-muted">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="table-td">
                                    <button
                                        onClick={() => handleDownload(order.id)}
                                        className="action-btn"
                                        title="Download Invoice"
                                    >
                                        <Download size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="empty-state">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
