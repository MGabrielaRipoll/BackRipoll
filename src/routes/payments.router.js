import { Router } from "express";
import { createdPayment } from '../controllers/payments.controller.js'

const router = Router();

router.post('/payments-intents', createdPayment);

export default router;