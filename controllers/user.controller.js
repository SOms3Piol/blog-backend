import { User } from "../models/user.js";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import sendMail from "../utiles/sendMail.js";
import bcrypt from "bcryptjs";




const generateAccessToken = async ( email) => {
    const token = jwt.sign({ username: email} , process.env.TOKEN_SECRET , {expiresIn:'24h'})   
    return token;
}

const registerUser = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { email, password } = req.body;
        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(403).json(
                new ApiResponse(403, {}, 'User already exists')
            );
        }

        const token = await generateAccessToken(email);
        const user = new User({
            email,
            password,
            verificationToken: token
        });

        await user.save();
        await sendMail(email, token, 'verify');

        return res.status(201).json(
            new ApiResponse(200, user.email, 'User registered successfully')
        );
    } catch (error) {
        console.error('Error in registerUser:', error);
        return res.status(500).json(
            new ApiResponse(500, {}, 'Something went wrong')
        );
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json(
                new ApiResponse(401, {}, 'User is not registered')
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(
                new ApiResponse(401, {}, 'Invalid email or password')
            );
        }

        if (!user.isVerified) {
            const token = await generateAccessToken(email);
            await sendMail(email, token, 'verify');
            return res.status(401).json(
                new ApiResponse(401, { isVerified: user.isVerified }, 'Verification email sent')
            );
        }

        const token = await generateAccessToken(email);
        return res.status(200).json(
            new ApiResponse(200, { email: user.email, token }, 'Login successful')
        );
    } catch (error) {
        console.error('Error in loginUser:', error);
        throw new ApiError(500, 'Something went wrong');
    }
};





const verifyUser = async (req, res) =>{
     const { token } = req.query;
     try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne(decoded?.email);
        console.log(user.verificationToken);
        if(user){
            user.isVerified = true;
            user.verificationToken = undefined;
            const savedUser  = await user.save();
            return res.status(201).json(
                new ApiResponse(200 , savedUser , "Verification is completed")
            )
        }
        return res.status(401).json(
            new ApiResponse(401 , { } , "Invalid Token")
        )
     } catch (error) {
        return res.status(401).json(
            new ApiResponse(401 , { } , "Invalid Token")
        )
     }
}



export { 
    loginUser,
    registerUser,
    verifyUser
 }