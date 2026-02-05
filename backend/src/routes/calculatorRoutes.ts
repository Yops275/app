import { Router } from 'express';
import { calculatePackaging } from '../controllers/calculatorController';
import { validate } from '../middleware/validate';
import { calculatorSchema } from '../schemas/calculatorSchema';

const router = Router();

/**
 * @swagger
 * /calculator/calculate:
 *   post:
 *     summary: Calculate optimal packaging
 *     tags: [Calculator]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     length:
 *                       type: number
 *                     width:
 *                       type: number
 *                     height:
 *                       type: number
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Optimal box and packing result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendedBox:
 *                   type: object
 *                 packingResult:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.post('/calculate', validate(calculatorSchema), calculatePackaging);

export default router;
