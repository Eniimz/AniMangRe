import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import cookieParser from 'cookie-parser';
import timeout from 'connect-timeout';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config()

// const MongoClient = new mongodb.MongoClient(connectionURL, { useNewUrlParser: true })


mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("MongoDB is connected")
}).catch((err) => {
    console.log(err)
})

const app = express();

app.use(timeout('400s'));
app.use(express.json())
app.use(cookieParser())


const _dirname = path.dirname("");
const baseDir = path.join('C:\\Tryin Projects\\Trying React\\Full stack')
const buildPath = path.join(baseDir ,"FirstFullStack", "dist" )

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000!!")
})

process.on('uncaughtException', (err) => {
    console.log(err)
})



app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes )
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)


app.use(express.static(buildPath))

app.get("/*", (req, res) => {
    res.sendFile(
        path.join(baseDir, "FirstFullStack", "dist", "index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            } 
        }
    );

})

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error Occured"

    res.status(statusCode).json({
        success : false,
        statusCode,
        message

    })
})


