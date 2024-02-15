import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import errorHandler from "../utils/errorHandler.js"
import dotenv from 'dotenv'
import { MongoClient } from "mongodb"


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

    if(foundUser[0]){
        const hashedPassword = foundUser[0].password
        isAuthenticated = await bcryptjs.compare(password, hashedPassword)
    }

    if(isAuthenticated){
        res.json({
            message : "user authenticated",
            authenticated: true
    })
    }
    else{
         return next(errorHandler(400, "Email or Password is Incorrect"))
    }

  }catch(error){
    return next(error)
  }
    


}