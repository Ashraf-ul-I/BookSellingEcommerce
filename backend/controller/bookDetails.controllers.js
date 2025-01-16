
    ///trying to upload seperate multiple file but fail will do this later
    // const photos = [];
    // const documents = [];
    // const videos = [];

    // uploadFiles.forEach((file) => {
    //     const fileType = file.mimetype.split("/")[0];
    //     const fileData = {
    //         url: file.path, // Replace with actual Cloudinary URL if using Cloudinary
    //         format: file.mimetype.split("/")[1],
    //         type: fileType,
    //         size: file.size,
    //         public_id: file.filename || file.public_id, // Cloudinary public ID
    //     };

    //     if (fileType === "image") {
    //         photos.push(fileData);
    //     } else if (fileType === "application") {
    //         documents.push(fileData);
    //     } else if (fileType === "video") {
    //         videos.push(fileData);
    //     }
    // });



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