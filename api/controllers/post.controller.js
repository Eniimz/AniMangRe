import Post from "../models/post.model.js";
import errorHandler from "../utils/errorHandler.js";

export const createPost = async (req, res, next) => {

    const {title, src, description} = req.body;

    if(!title || !src || !description){
        return next(errorHandler(400, "All fields are required"))
    }

    const newPost = new Post({
        title,
        src,
        description

    })

    try{
        await newPost.save()
        res.status(200).json({message: "post saved!"})
    }catch(error){
        next(error)
    }

}
    

