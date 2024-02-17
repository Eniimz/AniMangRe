import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import errorHandler from "../utils/errorHandler.js"
import dotenv from 'dotenv'
import { MongoClient } from "mongodb"
import jwt from 'jsonwebtoken'


export const signUp = async (req, res, next) => {
    const {username, email, password } = req.body

    if (!username || !email || !password || username === '' || password === '' || email === ''){
        next(errorHandler(400, "All fields are required"))  //here we are creating an error (a self defined error thus we made an errorHandler)
    }

    console.log(req.body)

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password : hashedPassword
    })

    try{
    await newUser.save()
    res.json('User signed up')
    } catch(error) {
        next(error)  // here we are catching an error, thus we have the acces of error and are not creating an error ad so we dont need to call errorHandler
    }

    // res.json('User signed up')    //multiple responses are not allowed (multiple res when catch block runs)
}

dotenv.config()
const client = new MongoClient(process.env.MONGO)
const db = client.db("firstFullStack")
const collection = db.collection("users")

export const signIn = async (req, res, next) => {
    const {email, password} = req.body

    if(!email || !password || email === '' || password === ''){
        next(errorHandler(400, "All fields are required"))
    }

  try{

    let isAuthenticated = false
    const foundUser = await collection.find({email}).toArray();  


    if(!foundUser[0]){
        return next(errorHandler(400, "User not found"))
    }

    if(foundUser[0]){
        const hashedPassword = foundUser[0].password
        isAuthenticated = await bcryptjs.compare(password, hashedPassword)
        
    }

    const token = jwt.sign({ id: foundUser[0]._id}, process.env.JWT_SECRET)

    

    const {password: pass, ...rest} = foundUser[0]

    if(isAuthenticated){
        res.status(200).cookie('access_token', token, { 
            httpOnly: true}).json(rest)
    }
    else{
         return next(errorHandler(400, "Password Incorrect"))
    }

  }catch(error){
    return next(error)
  }
}

export const googleSignIn = async (req, res, next) => {

    const {name, email, pfp} = req.body
    console.log("body: ",req.body)

    try{
        const foundUser = await User.findOne({email})

        if(foundUser){
            const {password: pass, ...rest} = foundUser
            const token = jwt.sign({id: foundUser._id}, process.env.JWT_SECRET)
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
        else{
            const randomPassword = Math.random().toString(36).slice(-8) 
            const hashpassword = bcryptjs.hashSync(randomPassword, 10)

            const newUser = new User({
                username: name.toLowerCase().split(' ').join(' ') + Math.random().toString(36).slice(-4),
                email,
                password: hashpassword,
                pfp
            })

            await newUser.save()

            const {password , ...rest} = newUser._doc
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
            
        }
    }catch(error){
        next(error)
    }
    

}