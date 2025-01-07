import { User } from "../model/user.model.js";
export const isAdminVerify= async (res,req,next)=>{  
      const token = req.cookies.token; // Assuming the token is stored in cookies
      const user=await User.findById({_id});
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with your secret
            req.user = decoded; // Attach user info (e.g., { _id, email }) to req.user
            if(req.user.userId === user._id){
                if(user.isAdmin===true){
                    next();
                }else{
                    return res.status(400).json({success:false,message:"You are not admin"})
                }
            }
           
        } catch (error) {
            return res.status(403).json({ message: "Invalid token." });
        }
};
