import { Router } from 'express';
import { createPaymentIntent } from '../controllers/paymentController';

const router = Router();

router.post('/create-intent', createPaymentIntent);

export default router;
