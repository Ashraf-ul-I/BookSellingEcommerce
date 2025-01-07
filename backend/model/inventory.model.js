import mongoose from "mongoose";

const inventoryManage = new Schema({
   category:{
    type:String,
    required:true
   },
   books:[
    {
        bookId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'bookDetails',
         required:true
        },
        title:{
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
          }
    }
   ]
})

export const Inventory=mongoose.model('inventory',inventoryManage)