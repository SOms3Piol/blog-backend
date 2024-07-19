import { Router } from "express";
import { 
    loginUser, 
    registerUser,
    verifyUser
    
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = Router()

userRouter.route('/register').post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route('/verify').post(verifyUser)

//secured routes


export default userRouter