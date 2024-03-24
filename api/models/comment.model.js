import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    
    username: {
        type: String,
        required: true
    },
    pfp: {
        type: String
    },
    comment: {
        type: String
    },
    Likes: {
        type: Number,
        default: 0
    },
    postId: {
        type: String
    },
    userId: {
        type: String
    },
    stars: {
        type: Number
    }

}, {timestamps: true}
)

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;