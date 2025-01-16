import express from 'express';
import { cancelOrder, createOrder, getOrder, salesReport, trackOrder } from '../controller/bookOrder.controller.js';
import { authenticate } from '../utils/authenticate.utils.js';
import { isAdminVerify } from '../utils/isAdmin.utils.js';
const router=express.Router();

router.post('/order-book',authenticate,createOrder);
router.get('/get-order', authenticate, getOrder);
router.patch('/cancel-order/:orderId', authenticate, cancelOrder);//this orderId will be send via frontend request when acquire in fetch so it can get via params
router.get('/track/:orderId/track-order', authenticate, trackOrder);
router.get('/sales-report',salesReport);
export default router;