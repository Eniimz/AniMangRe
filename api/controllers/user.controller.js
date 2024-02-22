import User from "../models/user.model.js"
import mongoose from "mongoose"
import bcryptjs from 'bcryptjs'
import { MongoClient } from "mongodb"
import dotenv from 'dotenv'



export const test = (req, res) => {
    res.json({message : 'API is working'})
}

export const updateUser = async (req, res, next) => {

    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    try{
        const foundUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                pfp: req.body.pfp
            },},{new: true})

            const {password, ...rest} = foundUser._doc

            return res.status(200).json(rest)
    }catch(error){
        return next(error)
    }    
}

dotenv.config()
const client = new MongoClient(process.env.MONGO)
const db = client.db("firstFullStack")
const collection = db.collection("users")

export const deleteUser = async (req, res, next) => {

    try{
        const foundUser = await User.findByIdAndDelete(req.params.userId)

        res.status(200).json("user has been deleted")
        
    }catch(error){
        next(error)
    }

}

