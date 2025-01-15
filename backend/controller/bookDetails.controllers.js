import { BookDetails } from "../model/BookDetails.model.js";


export const bookDetails = async (req, res) => {
    const { bookTitle, authorName, category, price, isbnNumber } = req.body;

    if (!bookTitle || !authorName || !category || !price) {
        throw new Error("All Fields are required");
    }
    const photoUrl=req.file?req.file.path:null;

    try {
       
        const books = new BookDetails({
            bookTitle,
            authorName,
            category,
            price,
            isbnNumber,
            photo:photoUrl
        });

        await books.save();
        res.status(200).json({
            success: true,
            message: "Books details saved successfully",
            books: {
                ...books._doc,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
