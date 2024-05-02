import express from "express";
import { createComment, getPostComments, deleteComment, updateComment, updateLikes} from "../controllers/comment.controller.js";
import { verifyUser } from "../utils/verifyUser.js"; 
const router = express.Router();

router.post('/create', createComment);
router.get('/getComments', getPostComments)
router.delete('/delete/:commentId', deleteComment)
router.put('/update/:commentId', updateComment)
router.put('/updateLikes/:commentId', verifyUser, updateLikes)

export default router;