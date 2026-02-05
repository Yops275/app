"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const database_1 = __importDefault(require("../config/database"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield database_1.default.connect();
    try {
        const { customerId, items, totalAmount } = req.body;
        yield client.query('BEGIN');
        // 1. Create Order
        const orderResult = yield client.query(`INSERT INTO orders (customer_id, total_amount, status) 
             VALUES ($1, $2, 'pending') 
             RETURNING id, created_at, status`, [customerId, totalAmount]);
        const orderId = orderResult.rows[0].id;
        // 2. Create Order Items
        for (const item of items) {
            yield client.query(`INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`, [orderId, item.productId, item.quantity, item.price]);
            // Optional: Update stock
            // await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.productId]);
        }
        yield client.query('COMMIT');
        res.status(201).json({
            message: 'Order created successfully',
            orderId,
            status: orderResult.rows[0].status
        });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Order creation error:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
    finally {
        client.release();
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query(`
            SELECT o.id, o.total_amount, o.status, o.created_at, c.name as customer_name 
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const orderResult = yield database_1.default.query(`
            SELECT o.*, c.name as customer_name, c.email as customer_email
            FROM orders o
            LEFT JOIN customers c ON o.customer_id = c.id
            WHERE o.id = $1
        `, [id]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const itemsResult = yield database_1.default.query(`
            SELECT oi.*, p.name as product_name
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `, [id]);
        res.json(Object.assign(Object.assign({}, orderResult.rows[0]), { items: itemsResult.rows }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getOrderById = getOrderById;
