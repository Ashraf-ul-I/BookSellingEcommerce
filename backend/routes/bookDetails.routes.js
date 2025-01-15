import express from 'express';
import { bookDetails } from '../controller/bookDetails.controllers.js';
import upload from '../multer/multer.js';
const router=express.Router();

router.post('/book-details',upload.single('photo'),bookDetails)

export default router