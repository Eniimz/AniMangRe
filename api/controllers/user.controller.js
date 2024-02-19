import User from "../models/user.model.js"
import mongoose from "mongoose"
import bcryptjs from 'bcryptjs'


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