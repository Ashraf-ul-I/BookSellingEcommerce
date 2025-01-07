import mongoose,{ Schema } from "mongoose"; 

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
        match: /^[a-zA-Z0-9 ]+$/
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
}, {timestamps: true});

export const User = mongoose.model('User', userSchema);
