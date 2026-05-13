import jwt from "jsonwebtoken";
import User from "../models/User.js";




const protectRoute = async (req,res,next)=>{
    try {
        // get token
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if(!token) return res.status(401).json({message:"Unauthorized, no token provided"});

        // verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.userId).select("-password");


        if(!user) return res.status(401).json({message:"Token is invalid, user not found"});


        req.user = user;
        next;
    } catch (error) {
        console.log("Authentication error", error.message);
        res.status(401).json({message:"Token is invalid"});
    }
}

export default protectRoute;