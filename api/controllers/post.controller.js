import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js"

export const create = async (req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,'you are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(403,'Please provide all required fields'))
    }
    const slug = req.body.title.split(' ').json('_').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'_');

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.body.user,
    });

    try {
       const savedPost = await newPost.save();
       res.status(201).json(savedPost) 
    } catch (error) {
        next(error)
    }

}