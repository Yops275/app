import { Router } from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderInvoice } from '../controllers/orderController';

const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *               totalAmount:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 * 
 * /orders/{id}/invoice:
 *   get:
 *     summary: Download Order Invoice
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF Invoice
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 * 
 * /orders/{id}/status:
 *   patch:
 *     summary: Update Order Status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, delivered, cancelled, returned]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/:id/invoice', getOrderInvoice);
router.patch('/:id/status', updateOrderStatus);

export default router;
