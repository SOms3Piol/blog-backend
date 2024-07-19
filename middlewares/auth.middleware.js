
import jwt from "jsonwebtoken"
import { User } from "../models/user.js";

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            return res.send({message: "Token is not present" , succes: false})
        }
    
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?.email)
    
        if (!user) {
            
            return res.send({message: "Token is Invalid" , succes: false})
        }
    
        req.user = user;
        next()
    } catch (error) {
        return res.send({message: "Token is Invalid" , succes: false})
    }
    
}