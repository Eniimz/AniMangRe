import express from 'express'
import { createPost, getPosts, getThumbnail, getPfp, deletePost, updatePost} from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createPost)
router.get('/edits', getPosts)
router.post("/getPfp", getPfp)
router.delete("/delete/:postId", deletePost);
router.put('/update/:postId', updatePost)
router.post('/thumbnail', getThumbnail)

export default router;