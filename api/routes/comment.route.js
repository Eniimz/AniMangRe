import express from "express";
import { createComment, getPostComments, deleteComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/create', createComment);
router.get('/getComments', getPostComments)
router.delete('/delete/:commentId', deleteComment)

export default router;