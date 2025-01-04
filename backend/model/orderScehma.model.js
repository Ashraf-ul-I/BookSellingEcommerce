import mongoose, { Schema } from "mongoose";

const orderSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    books:[
        { 
            book:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'bookDetails',
                required:true

            },
            quantity:{
                type:Number,
                required:true,
                min:1
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Pending', 'Processing', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

export const OrderBooks= mongoose.model('OrderBooks',orderSchema)