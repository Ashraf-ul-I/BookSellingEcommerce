import { OrderBooks } from "../model/orderScehma.model.js";
import { BookDetails } from "../model/BookDetails.model.js";
import moment from 'moment'
import {SalesReport} from '../model/salesReport.model.js'
export const createOrder=async (req,res)=>{
    try {
        
        console.log(req.user)
        const {books}=req.body;
        const userId=req.user.userId;

        if(!books || books.length===0){
            return res.status(400).json({success:false,message:'No books provided for the order'});
        }

        let totalAmount=0;

        for(const item of books){
            const book= await BookDetails.findById(item.book);
            if(!book){
                return res.status(404).json({ message: `Book with ID ${item.book} not found.` });
            }
            totalAmount+=book.price * item.quantity;
        }

        const order = new OrderBooks({
            user: userId,
            books,
            totalAmount,
          });
      
          await order.save();
          res.status(201).json({success:true, message: 'Order placed successfully.', order });
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to place the order.', error: error.message });
    }
}

export const getOrder = async (req, res) => {
    const userId = req.user.userId;
    try {
        // Fetch orders and populate the books field
        const orders = await OrderBooks.find({ user: userId }).populate({
            path: "books.book",
            select: "bookTitle authorName price category isbnNumber",
        });

        if (orders.length > 0) {
            // Extract the required details from the orders
            const filteredOrders = orders.map(order => ({
                _id: order._id,
                books: order.books.map(item => ({
                    bookTitle: item.book?.bookTitle,
                    authorName: item.book?.authorName,
                    price: item.book?.price,
                    category: item.book?.category,
                    isbnNumber: item.book?.isbnNumber,
                    quantity: item.quantity,
                })),
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt,
            }));

            return res.status(200).json({
                success: true,
                message: "Orders retrieved successfully",
                orders: filteredOrders,
            });
            
        }

        return res.status(404).json({
            success: false,
            message: "No orders found for this user",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

//i want to track the record of user so i just changed the status didnot delete it permananetly
export const cancelOrder=async(req,res)=>{
    const {orderId}=req.params;
    const userId = req.user.userId;
    try {
        const order=await OrderBooks.findOne({_id:orderId,user:userId});
        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found or you do not have permission to cancel this order",
            });
        }
        order.status='Cancelled';
        await order.save();
        return res.status(204).json({
            success: true,
            message: "Order Cancelled Succesfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const trackOrder=async (req,res)=>{
    const {orderId}=req.params;
    
    if(!orderId){
        return res.status(401).json({success:false,message:'userid are not provided'});
    }

    try {
        const order=await OrderBooks.findById(orderId);
        if(!order.user){
            return res.status(404).
            json({success:false,message:'order didnot found'});
        };
        return res.status(200).json({success:true,message:"orderget Succesfull",status: order.status})
        
    } catch (error) {
        res.status(400).json({ error: 'Failed to track the order.' });
    }
}

export const salesReport = async (req, res) => {
    try {
      const currentDate = moment();
  
      // Loop for the last 5 weeks
      for (let i = 0; i < 5; i++) {
        // Calculate the start and end dates of the week
        const weekEnd = currentDate.clone().subtract(i, "weeks").endOf("week").toDate();
        const weekStart = currentDate.clone().subtract(i, "weeks").startOf("week").toDate();
  
        // Aggregate data for the specific week
        const weeklyReport = await OrderBooks.aggregate([
          { $unwind: "$books" }, // Unwind books array
          {
            $lookup: {
              from: "bookdetails", // Join with the bookDetails collection
              localField: "books.book",
              foreignField: "_id",
              as: "bookDetails",
            },
          },
          { $unwind: "$bookDetails" }, // Flatten bookDetails
          {
            $match: {
              createdAt: { $gte: weekStart, $lte: weekEnd }, // Match orders within the week
            },
          },
          {
            $group: {
              _id: "$bookDetails.category", // Group by category
              totalSales: { $sum: "$totalAmount" }, // Sum totalAmount
              totalBooksSold: { $sum: "$books.quantity" }, // Sum quantities
            },
          },
        ]);
  
        // Save each category report for the week
        for (const categoryReport of weeklyReport) {
          await SalesReport.create({
            category: categoryReport._id,
            totalSales: categoryReport.totalSales,
            totalBooksSold: categoryReport.totalBooksSold,
            weekStart,
            weekEnd,
          });
        }
      }
  
      res.json({ message: "5 Weekly Sales Reports Generated Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
