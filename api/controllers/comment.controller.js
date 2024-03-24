import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js";


export const createComment = async (req, res, next) => {

    const { username, pfp, comment, postId, userId } = req.body;

    console.log(req.body)

    try{

        const newComment = new Comment({
            username,
            postId,
            userId,
            pfp,
            comment
        })

        await newComment.save();

        res.status(200).json({
            success: true,
            message: newComment
        })

    }catch(err){
        next(err);
    }

}

export const getPostComments = async (req, res, next) => {

    try{

        const foundComments = await Comment.find({
            ...(req.query.postId && {postId: req.query.postId})
        })

        let totalComments = foundComments.length

        if(foundComments.length == 0){
            totalComments = 0;
        }

        res.status(200).json({
            comments: foundComments,
            totalComments
        })

    }catch(err){
        next(err)
    }

}

export const deleteComment = async (req, res, next) => {

    const toDelete = await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
        success: true,
        message: "deleted successfully"
    })
    

}