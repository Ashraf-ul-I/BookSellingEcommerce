import express from 'express';
import { bookDetails } from '../controller/bookDetails.controllers.js';
const router=express.Router();

router.post('/book-details',bookDetails)

export default router