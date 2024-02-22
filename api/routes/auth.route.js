import express from 'express'
import { signUp, signIn, googleSignIn,signOut } from '../controllers/auth.controller.js'


const router = express.Router()

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/google', googleSignIn)
router.post('/signOut', signOut)
export default router