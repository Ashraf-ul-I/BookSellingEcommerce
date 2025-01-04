import express from 'express';
import { login, resetPassword, SignUp } from '../controller/authUser.controllers.js';

const router=express.Router();

router.post('/login',login);
router.post('/signup',SignUp);
router.post('/reset-password',resetPassword);

export default router;