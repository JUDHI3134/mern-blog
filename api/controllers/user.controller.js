import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import User from '../models/user.model.js'

export const test = (req,res)=>{
    res.json({message:"Api is working"})
}

export const updateUser = async (req,res,next) =>{
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403,'you are not allowed to update this user'));
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400,'password must be atleast 6 character')); 
        }
        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400,'username must between 7 to 20 character'));
        }
        if(req.body.username.include(' ')){
            return next(errorHandler(400,'username can not contain spaces'));
        }
        if(req.body.username !== req.body.username.toLowercase()){
            return next(errorHandler(400,'username must be lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400,'username can only contain letter and number'));
        }
    }
        try {
          const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                profilePicture:req.body.profilePicture,
                password:req.body.password,
            },
          },{new:true})  
          const {password,...rest} = updatedUser._doc;
          res.status(200).json(rest);
        } catch (error) {
            next(error)
        }
    
}