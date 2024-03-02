import Post from "../models/post.model.js";
import errorHandler from "../utils/errorHandler.js";
import Ffmpeg from "fluent-ffmpeg";
const {ffprobe} = Ffmpeg;
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import http from 'http';
import fs from 'fs';
import {firebaseConfig} from '../../FirstFullStack/src/firebase.js';
import {getDownloadURL,uploadBytes, ref, getStorage} from 'firebase/storage';
import { initializeApp } from "firebase/app";
import axios, { Axios } from "axios";
import * as stream from 'stream';
import url from 'url'

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)





const __dirname = path.resolve();

const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe'
const ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';

Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);



export const createPost = async (req, res, next) => {

    const {userId, title, src, description} = req.body;

    if(!title || !src || !description || title === ''|| src === '' || description === ''){
        return next(errorHandler(400, "All fields are required"))
    }

    const newPost = new Post({
        userId: req.user.id,
        title,
        src,
        description
    })

    try{
        await newPost.save()
        res.status(200).json({message: "post saved!"})
    }catch(error){
        next(error)
    }

}
    
export const getPosts = async (req, res, next) => {

    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1

        const getPosts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.title && { title: req.query.title }),
            ...(req.query.searchTerm && {
                $or: [
                {title: {$regex: req.query.searchTerm, $options: 'i'}}
            ]   })
         })
        .sort({ updatedAt: sortDirection })
        .skip({ startIndex })
        .limit(limit)

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo}
        })

    
        res.status(200).json({
            getPosts,
            lastMonthPosts, 
            totalPosts
        })

    }catch(error){
        next(error)
    }

}

const removeThumbnails = (thumbnailDirectory) => {
    const files = fs.readdirSync(thumbnailDirectory);
    files.forEach((file) => {
        const filePath = path.join(thumbnailDirectory, file);
        fs.unlinkSync(filePath) 
    })
}


export const getThumbnail = (req, res, next) => {

    console.log("entered....");

    const firebaseUrl = req.body.filePath;
    const urlObj = new URL(firebaseUrl);

    const options = {
        hostname: urlObj.hostname,
        port: 443, 
        path: urlObj.pathname + urlObj.search,
        method: 'GET'
    }

    const {fileName} = req.body;
    const tempFilePath = path.join(__dirname, 'temp', `${fileName}-${uuidv4()}`)
    const tempThumbnailDirectory = path.join(__dirname, 'thumbnails')
    const file = fs.createWriteStream(tempFilePath);

    
    console.log("Now Making The fetch get request")
    console.log("this is the body ......: ", req.body)
    try{
        https.get(firebaseUrl, (response) => {
            
            console.log("Using the response from fetch")
            
            response.pipe(file);

            console.log("after piping...")
            
            let fileDuration = '';
            let storageRef = '';
            let thumbnailUrl = '';      
    
            file.on('finish', () => {
                console.log("entered FileStream.on...")
                file.close(() => {
                    console.log("Performing action after closing the fileStream")
                    Ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
                        console.log("probing the video/edit")

                        if(err){
                            console.log("ffprobe error occurred...")
                            fs.unlinkSync(tempFilePath);
                            return next(err)
                        }
    
                        // console.dir(metadata)
                        // console.log("Durations of the video: ", metadata.format.duration)
                        console.log("geting video duration....")
                        fileDuration = metadata.format.duration;
                    })
    
                    Ffmpeg(tempFilePath)
                    .on('filenames', (filenames) => {
                        console.log("---Now Entering Ffmpeg.on.... ---")
            
                        console.log('Will generate ' + filenames.join(', '));
                        storageRef = ref(storage, `thumbnails/${filenames[0]}`)
    
                        console.log("wil upload thumbnail now...")
                        uploadBytes(storageRef, filenames[0]).then(() => {
                            console.log("Thumbnail Uploaded to")
                            getDownloadURL(storageRef).then((downloadUrl) => {
    
                                thumbnailUrl = downloadUrl;
                                console.log("downoadUrl: ", downloadUrl)
                                
                                fs.unlinkSync(tempFilePath)
                                removeThumbnails(tempThumbnailDirectory)
                                
                                res.status(200).json({
                                    message: "reached after upload",
                                    fileDuration: fileDuration,
                                    thumbnailUrl : thumbnailUrl
                                })    
                            })
                        })   
                    })
                    .on('end', () => {
    
                        console.log("Screenshots Taken")  
                        
                    })
                    .screenshots({
                        // Will take screens at 20%, 40%, 60% and 80% of the video
                        count: 3,
                        folder: 'thumbnails',
                        size:'336x118',
                        // %b input basename ( filename w/o extension )
                        filename:'thumbnail-%b.png'
                    })
                })
                
            })
            
        }).on('error', (error) => {
            console.error('Error: ', error)
        })


    }catch(error){
        fs.unlinkSync(tempFilePath)
        return next(error)
    }
      
}
