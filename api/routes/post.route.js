import express from 'express'
import { createPost, getPosts, getThumbnail } from '../controllers/post.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyUser, createPost)
router.get('/edits', getPosts)
router.post('/thumbnail', getThumbnail)

export default router;