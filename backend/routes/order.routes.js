import express from 'express';
import { createOrder } from '../controller/bookOrder.controller.js';

const router=express.Router();

router.post('/order-book',createOrder);

export default router;