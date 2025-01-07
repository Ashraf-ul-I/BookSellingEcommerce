import express from 'express';
import { createOrder, getOrder } from '../controller/bookOrder.controller.js';
import { authenticate } from '../utils/authenticate.utils.js';
import { isAdminVerify } from '../utils/isAdmin.utils.js';
const router=express.Router();

router.post('/order-book',authenticate,createOrder);
router.get('/get-order', authenticate, getOrder);

export default router;