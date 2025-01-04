import { User } from "../model/user.model.js";
import bcryptjs from 'bcryptjs'
import { generateJsonWebandCookies } from "../utils/generateCookies.js";
import jwt, { decode } from 'jsonwebtoken';

export const login=async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        throw new Error("All fields are required");
    };
    try {
        const user=await User.findOne({email});

    const verifyPassword=await bcryptjs.compare(password,user.password);
    if(!verifyPassword){
        throw new Error('User credential wrong');
    };

    generateJsonWebandCookies(res,user._id);
    user.lastLogin=new Date();
    await user.save();

    res.status(200).json({success:true,message:"User logged in Succesfully",
        user:{
            ...user._doc,
            password:undefined
        }
    })
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
    }

         
}
export const SignUp=async (req,res)=>{
    const {name,email,password,confirmPassword}=req.body;
    
    //if the user didnot input all the fields in form so then at first prevent 
    // the null form submition to save 
    if(!name || !email || !password || ! confirmPassword){
        throw new Error("All fields are required");
    }
    //checking the password is same or not
    if(password!==confirmPassword){
        res.status(400).json({success:false,message:"Passwords do not match"})
    }

    try {
        //to prevent the same email for multiple user so we have to check the email is already in db or not
        const userAlreadyexist= await User.findOne({email});
        if(userAlreadyexist){
           return res.status(200).json({success:false,message:"User already Exist"});
        }
        //after checking we are sure that user are not available so they can signup
        //so we hashed the password of user they given because of security perpose
        const hashedPassword= await bcryptjs.hash(password,10);
        //currently i have not subcription model of email and other twf authentication so 
        //for user easyness we give them a code to store so then they can reset their password
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const resetPasswordToken = Array.from({ length: 8 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        //so we have to make a new user by calling new User() model of mongoose
        console.log(resetPasswordToken);
        const user= new User({
            userName:name,
            email:email,
            password:hashedPassword,
            resetToken:resetPasswordToken
        })
        await user.save();
        
        //generate cookies and jwt Token

        generateJsonWebandCookies(res,user._id);
        return res.status(201).json({success:true,message:"User created Succesfully",
            user:{
                ...user._doc,
                password:undefined
            }
        })
        
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

export const resetPassword=async (req,res)=>{
    const { email, resetToken, password, newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ success: false, message: "New password is required" });
    }

    const token = req.cookies.token; // Get the JWT token from cookies

    if (!token && !resetToken) {
        return res.status(401).json({ success: false, message: "No token or reset token, authorization denied" });
    }

    try {
        const user=await User.findOne({email})
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            // Ensure token is valid
            if (decoded.userId !== user._id.toString()) {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }

            // Validate current password
            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: "Invalid current password" });
            }

            // Hash new password before saving
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            user.password = hashedPassword;

            await user.save();
            return res.status(200).json({
                success: true,
                message: "Password has been changed successfully",
                user: {
                    ...user._doc,
                    password: undefined
                }
            });

        } else { 
            // If the user is not logged in, use the resetToken
            // Verify the reset token
            if (resetToken !== user.resetToken) {
                return res.status(400).json({ success: false, message: "Invalid reset token" });
            }

            // Hash new password before saving
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            user.password = hashedPassword;

            // Keep reset token in the database
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Password has been reset successfully",
                user: {
                    ...user._doc,
                    password: undefined
                }
            });
        }

    }  catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}