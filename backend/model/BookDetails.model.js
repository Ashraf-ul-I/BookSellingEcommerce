import mongoose,{Schema} from 'mongoose';

const bookDetails=new Schema({
    bookTitle:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
    },
    authorName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    isbnNumber:{
        type:String,
        required:true
    }
});

export const BookDetails= mongoose.model('bookDetails',bookDetails)