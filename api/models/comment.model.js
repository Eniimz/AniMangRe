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
    likes: {
        type: Array,
        default: [],
        
    },
    NumberOfLikes : {
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