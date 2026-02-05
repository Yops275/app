import { Request, Response } from 'express';
import pool from '../config/database';
import { InvoiceService } from '../services/invoiceService';
import { sendEmail } from '../services/emailService';

export const createOrder = async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
        const { customerId, items, totalAmount } = req.body;

        await client.query('BEGIN');

        // 1. Create Order
        const orderResult = await client.query(
            `INSERT INTO orders (customer_id, total_amount, status) 
             VALUES ($1, $2, 'pending') 
             RETURNING id, created_at, status`,
            [customerId, totalAmount]
        );
        const orderId = orderResult.rows[0].id;

        // 2. Create Order Items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.productId, item.quantity, item.price]
            );

            // Optional: Update stock
            // await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.productId]);
        }

        await client.query('COMMIT');

        // 3. Generate Invoice & Send Email (Async)
        const itemsWithDetails = [];
        for (const item of items) {
            // We need product names for the invoice. ideally we fetched this earlier.
            // For MVP, doing a quick lookup or just using passed data if available.
            // Let's assume we fetch it or client passed it. To be safe, let's query.
            const pRes = await client.query('SELECT name FROM products WHERE id = $1', [item.productId]);
            itemsWithDetails.push({
                productName: pRes.rows[0]?.name || 'Product',
                quantity: item.quantity,
                price: item.price
            });
        }

        // We need customer email
        const customerRes = await client.query('SELECT name, email FROM customers WHERE id = $1', [customerId]);
        const customer = customerRes.rows[0];

        if (customer && customer.email) {
            const invoiceService = new InvoiceService();
            const pdfBuffer = await invoiceService.generateInvoice({
                orderId,
                customerName: customer.name,
                customerEmail: customer.email,
                date: new Date(),
                totalAmount,
                items: itemsWithDetails
            });

            // Send Email in background (don't await to block response)
            sendEmail(
                customer.email,
                `Invoice for Order #${orderId}`,
                `Dear ${customer.name},\n\nThank you for your order. Please find your invoice attached.\n\nBest regards,\nPackageMatch Team`,
                [
                    {
                        filename: `invoice-${orderId}.pdf`,
                        content: pdfBuffer
                    }
                ]
            ).catch(err => console.error('Failed to send invoice email', err));
        }

        res.status(201).json({
            message: 'Order created successfully',
            orderId,
            status: orderResult.rows[0].status
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Failed to create order' });
    } finally {
        client.release();
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT o.id, o.total_amount, o.status, o.created_at, c.name as customer_name 
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const orderResult = await pool.query(`
            SELECT o.*, c.name as customer_name, c.email as customer_email
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE o.id = $1
        `, [id]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const itemsResult = await pool.query(`
            SELECT oi.*, p.name as product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [id]);

        res.json({
            ...orderResult.rows[0],
            items: itemsResult.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1. Get current status
        const currentOrder = await pool.query('SELECT status FROM orders WHERE id = $1', [id]);
        if (currentOrder.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const currentStatus = currentOrder.rows[0].status;

        // 2. Validate Transition
        const validTransitions: Record<string, string[]> = {
            'pending': ['paid', 'cancelled'],
            'paid': ['shipped', 'cancelled', 'refunded'],
            'shipped': ['delivered', 'returned'],
            'delivered': [],
            'cancelled': [],
            'returned': ['refunded']
        };

        if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(status)) {
            return res.status(400).json({
                message: `Invalid status transition from ${currentStatus} to ${status}`
            });
        }

        // 3. Update Status
        const result = await pool.query(
            'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        const updatedOrder = result.rows[0];

        // 4. Send Notification
        // Fetch customer email
        const customerRes = await pool.query(
            'SELECT c.email, c.name FROM customers c JOIN orders o ON c.id = o.customer_id WHERE o.id = $1',
            [id]
        );
        const customer = customerRes.rows[0];

        if (customer && customer.email) {
            sendEmail(
                customer.email,
                `Order #${id} Status Update: ${status.toUpperCase()}`,
                `Dear ${customer.name},\n\nYour order #${id} has been updated to: ${status.toUpperCase()}.\n\nBest regards,\nPackageMatch Team`
            ).catch(err => console.error('Failed to send status email', err));
        }

        res.json(updatedOrder);

    } catch (error) {
        console.error(error); // We will switch to logger later
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrderInvoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Fetch Order Data
        const orderResult = await pool.query(`
            SELECT o.*, c.name as customer_name, c.email as customer_email
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE o.id = $1
        `, [id]);

        if (orderResult.rows.length === 0) return res.status(404).json({ message: 'Order not found' });

        const itemsResult = await pool.query(`
            SELECT oi.*, p.name as product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [id]);

        const invoiceService = new InvoiceService();
        const pdfBuffer = await invoiceService.generateInvoice({
            orderId: orderResult.rows[0].id,
            customerName: orderResult.rows[0].customer_name || 'Guest',
            customerEmail: orderResult.rows[0].customer_email || 'N/A',
            date: new Date(orderResult.rows[0].created_at),
            totalAmount: parseFloat(orderResult.rows[0].total_amount),
            items: itemsResult.rows.map(item => ({
                productName: item.product_name,
                quantity: item.quantity,
                price: parseFloat(item.price)
            }))
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
            'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate invoice' });
    }
};
