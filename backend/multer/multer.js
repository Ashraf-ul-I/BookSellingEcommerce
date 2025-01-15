import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'
import cloudinary from '../utils/cloudinary.js';
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'bookDetailsFile',
        allowed_formats:['jpg', 'jpeg', 'png','mp4', 'pdf']
    }
})

const upload=multer({storage});

export default upload;