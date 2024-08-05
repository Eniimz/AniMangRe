import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    videoSrc: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    thumbnailSrc: {
        type: String,
        default: '' //'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mub.eps.manchester.ac.uk%2Fscience-engineering%2Fpage%2F29%2F&psig=AOvVaw0_dDIMsE6qL21R77vc_84y&ust=1709545999620000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCICThqHp14QDFQAAAAAdAAAAABAI'
    },
    pfp: {
        type: String,
        default: ''
    },
    postCreator: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0,
    }
},{timestamps: true}
)

const Post = mongoose.model('Post', postSchema)

export default Post
