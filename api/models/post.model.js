import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
},{timestamps: true}
)

const Post = mongoose.model('Post', postSchema)

export default Post
