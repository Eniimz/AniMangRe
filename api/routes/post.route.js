import express from 'express'
import { createPost, getPosts, getThumbnail, getPfp } from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createPost)
router.get('/edits', getPosts)
router.post("/getPfp", getPfp)
router.post('/thumbnail', getThumbnail)

export default router;