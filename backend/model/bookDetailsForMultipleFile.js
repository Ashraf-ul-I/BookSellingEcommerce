import mongoose,{Schema} from "mongoose";

const fileSchema=new Schema({
    url:{type:String,required:true},
    format: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true }, // File size in bytes
    public_id: { type: String, required: true }, // Cloudinary public ID
})

// Schema for book details
const bookDetailsSchemaMultipleFile = new Schema({
    bookTitle: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String, // URL of the book's thumbnail
    },
    authorName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isbnNumber: {
        type: String,
        required: true,
    },
    photos: [fileSchema], // Array of uploaded photos
    documents: [fileSchema], // Array of uploaded documents (e.g., PDFs)
    videos: [fileSchema], // Array of uploaded videos
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

export const BookDetailsMF = mongoose.model('BookDetailsMF', bookDetailsSchemaMultipleFile);