
import mongoose , { Schema } from 'mongoose';
import bcrypt from 'bcryptjs'

const userSchema = new Schema({

    email:{
        type:String,
        required:[ true , "Please provide the email"],
        unique:true
    },
    password:{
        type:String,
        required:[ true , "Please provide the password" ],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type:String,
        default: undefined
    }
})

userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
         next();
    } catch (error) {
        return next(error);
    }
});


const User =  mongoose.model('User', userSchema);
export  { User } ;