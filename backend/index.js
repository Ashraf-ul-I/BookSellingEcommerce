import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from '../backend/routes/auth.routes.js'
import bookDetails from '../backend/routes/bookDetails.routes.js'
import orderRoutes from './routes/order.routes.js'
import { connectDB } from './db/connectDB.js';
import dotenv from 'dotenv'

const app=express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/books',bookDetails);
app.use('/api/orders',orderRoutes)
//converting the uri parameter to string
dotenv.config();
const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running on port ${PORT}`);
})
