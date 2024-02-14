import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import errorHandler from "../utils/errorHandler.js"


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