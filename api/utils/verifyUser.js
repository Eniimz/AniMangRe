import errorHandler from "./errorHandler.js";
import jwt from 'jsonwebtoken'

export const verifyUser = (req, res, next) => {

    const token = req.cookies.access_token;

    if(!token){
        next(errorHandler(400, "Unauthoirzed"))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if(err){
            next(errorHandler(400, err.message))
        }

        req.user = user;
        next()
    })

}