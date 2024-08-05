import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js";
import errorHandler from "../utils/errorHandler.js";


export const createComment = async (req, res, next) => {

    const { username, pfp, comment, postId, userId, stars } = req.body;

    console.log(req.body)

    try{

        const newComment = new Comment({
            username,
            postId,
            userId,
            pfp,
            comment,
            stars
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

        let sum = 0;
        let overallRating = 0;

        foundComments.forEach(comment => {

            sum += comment.stars;
            
        })

        if(totalComments != 0){
            overallRating = sum/totalComments;
        }

        if(foundComments.length == 0){
            totalComments = 0;
        }

        await Post.findByIdAndUpdate({ _id: req.query.postId},
            {
                $set:{
                    rating: overallRating
                }
            }, {new: true})

        res.status(200).json({
            comments: foundComments,
            totalComments,
            overallRating: overallRating.toFixed(1)
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

export const updateComment = async (req, res, next) => {

    const { username, comment, stars } = req.body;

    try{    
        const updatedUser = await Comment.findByIdAndUpdate(req.params.commentId, {
            $set: {
                comment,
                stars
            }
        }, { new: true });

        res.status(200).json({
            message: 'Updated successfully',
            comment: updatedUser
        })
    }catch(err){
        next(err);
    }

}

export const updateLikes = async (req, res, next) => {

    try{
        const foundComment = await Comment.findByIdAndUpdate(req.params.commentId);

        if(!foundComment){
            next(errorHandler(400, "An error occured"))
        }

        const userIndex = foundComment.likes.indexOf(req.user.id);

        if(userIndex === -1){
            foundComment.NumberOfLikes += 1;
            foundComment.likes.push(req.user.id)

        }else{
            foundComment.NumberOfLikes -= 1;
            foundComment.likes.splice(req.user.id, 1)
        }

        await foundComment.save();

        res.status(200).json({
            success: true,
            message: "Update successfully",
            userId: req.user.id, 
            NumberOfLikes: foundComment.NumberOfLikes,
            likesArray: foundComment.likes
        })

    }catch(err){
        next(err)
    }

}