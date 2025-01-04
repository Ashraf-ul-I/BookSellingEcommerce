import { OrderBooks } from "../model/orderScehma.model.js";
import { BookDetails } from "../model/BookDetails.model.js";

export const createOrder=async (req,res)=>{
    try {

        const {books}=req.body;
        const userId=req.user._id;

        if(!books || books.length===0){
            return res.status(400).json({success:false,message:'No books provided for the order'});
        }

        let totalAmount=0;

        for(const item of books){
            const book= BookDetails.findById(item.book);
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