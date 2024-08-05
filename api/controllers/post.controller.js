import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler.js";
import Ffmpeg from "fluent-ffmpeg";
const {ffprobe} = Ffmpeg;
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import fs, { read } from 'fs';
import { Readable } from "stream";
import * as stream from 'stream';
import url from 'url'
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

import serviceAccount from '../animangre-1c9c0-firebase-adminsdk-6qu8y-9840e76a9b.json' assert { type: 'json' };
import { error } from "console";
import { config } from "dotenv";
import { request } from "http";

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'animangre-1c9c0.appspot.com'
})

const bucket = getStorage().bucket();

async function uploadFileToStorageAndGetUrl(fileContent, fileName) {
    try {
      const file = bucket.file(`thumbnails/${fileName}`); //creating a reference for the thubmnail in the firebase storage bucket => thumbnails/filname
      await file.upload(fileContent, {
        contentType: 'image/png', // Set the content type appropriately
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuidv4()
          }
        }
      });
      console.log(`${fileName} uploaded to Firebase Storage successfully.`);

      const config = {
        version: 'v2',
        action : 'read',
        expires : '3-07-2025'
      }

      const [url] = await file.getSignedUrl(config);
      console.log("URL INSIDE THE FUNCTION: ", url)
      


    } catch (error) {                                           
    //   fs.unlinkSync(tempFilePath)
      console.error('Error uploading file to Firebase Storage:', error);
    }
  }


const __dirname = path.resolve();

const ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe'
const ffprobePath = 'C:\\ffmpeg\\bin\\ffprobe.exe';

Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);



export const createPost = async (req, res, next) => {

    const {userId, title, src, description, thumbnailSrc} = req.body;

    if(!title || !src || title === ''|| src === ''){
        return next(errorHandler(400, "All fields are required"))
    }

    const newPost = new Post({
        userId: req.user.id,
        title,
        videoSrc: src,
        thumbnailSrc,
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
            ...(req.query.postId) && { _id: req.query.postId },
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.title && { title: req.query.title }),
            ...(req.query.searchTerm && {
                $or: [
                {title: {$regex: req.query.searchTerm, $options: 'i'}}
            ]   })
         })
        .sort({ createdAt: sortDirection })
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

const getFirstFile = (directory) => {
    try{
        const files = fs.readdirSync(directory)
    
        if(files.length === 0){
            console.log("Error: The Directory is empty..") 
        }else{
            console.log("The Directory is not empty")
        }

        const filePath = path.join(directory, files[0]); 
        const fileContent = fs.readFileSync(filePath)

        return fileContent
        

    }catch(error){
        console.log("Error while getting the first File: ", error.message)
    }
    
} 


export const getThumbnail = (req, res, next) => {

    console.log("entered....");
    let thumbnailFileName = '';

    const firebaseUrl = req.body.filePath;

    const {fileName} = req.body;
    const tempFilePath = path.join(__dirname, 'temp', `${fileName}-${uuidv4()}`) //creating temp video file

    const tempThumbnailDirectory = path.join(__dirname, 'thumbnails')

    const file = fs.createWriteStream(tempFilePath); //creating a write stream - a mechanism so that data can be written to the file

    
    console.log("Now Making The https get request")
    console.log("this is the body ......: ", req.body)
    try{
        https.get(firebaseUrl, (response) => {

            /*Here , we are making a request to the url(video url from firebase Storage), getting its data
            then piping the data to a write stream which is pointing towards a file, in this way url content
            is transfered to the file and we get the data in a file ,that is video in a file (here, in this scenario).
            */
            
            console.log("Using the response from https")
            
            response.pipe(file);

            console.log("after piping...")
            
            let fileDuration = '';
    
            file.on('finish', () => {
                console.log("entered FileStream.on...")
                file.close(() => {
                    console.log("Performing action after closing the fileStream")
                    Ffmpeg.ffprobe(tempFilePath, (err, metadata) => { //after we get video in file form, we probe it for getting any data about it
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

                        thumbnailFileName = filenames[0];

                    })
                    .on('end', async () => {

                        console.log("Screenshots Taken")  
                        const firstThumbnailFile = getFirstFile(tempThumbnailDirectory);
                        // uploadFileToStorageAndGetUrl(firstThumbnailFile, thumbnailFileName);

                        try {
                            const file = bucket.file(`thumbnails/${thumbnailFileName}`); //creating a reference for the thubmnail in the firebase storage bucket => thumbnails/filname
                            await file.save(firstThumbnailFile, {
                              contentType: 'image/png', // Set the content type appropriately
                              metadata: {
                                metadata: {
                                  firebaseStorageDownloadTokens: uuidv4()
                                }
                              }
                            });
                            console.log(`${thumbnailFileName} uploaded to Firebase Storage successfully.`);
                      
                            const config = {
                              version: 'v2',
                              action : 'read',
                              expires : '3-07-2025'
                            }
                      
                            const [url] = await file.getSignedUrl(config);
                            console.log("URL INSIDE THE FUNCTION: ", url)

                            fs.unlinkSync(tempFilePath);
                            removeThumbnails(tempThumbnailDirectory)
                            
                            res.json({
                                success: true,
                                thumbnailUrl: url,
                                thumbnail: thumbnailFileName,
                                fileDuration
                            })
                      
                          } catch (error) {
                            fs.unlinkSync(tempFilePath)
                            removeThumbnails(tempThumbnailDirectory)
                            console.error('Error uploading file to Firebase Storage:', error);
                          }

                        

                        
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
            fs.unlinkSync(tempFilePath)
            removeThumbnails(tempThumbnailDirectory) 
            console.error('Error: ', error)
        })


    }catch(error){
        fs.unlinkSync(tempFilePath)
        removeThumbnails(tempThumbnailDirectory)
        return next(error)
    }
      
}


export const getPfp = (req, res, next) => {

    User.findById(req.body.userId).then((result) => {
        res.status(200).json({
            pfp : result.pfp
        })
    }).catch(err => {
        next(err)
    })
}

export const deletePost = async (req, res, next) => {
    try{
        const post = await Post.findByIdAndDelete(req.params.postId);

        res.status(200).json("post has been deleted");

    }catch(err){
        next(err)
    }
}

export const updatePost = async (req, res, next) => {

    try{
        const user = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description
                }
            }, {new: true}
        )

        res.status(200).json("updated successfully");

    }catch(error){
        next(error)
    }

}