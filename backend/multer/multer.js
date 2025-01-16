import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'
import cloudinary from '../utils/cloudinary.js';
const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'bookDetailsPicture',
        allowed_formats:['jpg', 'jpeg', 'png']
    }
})

const upload=multer({storage});

export default upload;