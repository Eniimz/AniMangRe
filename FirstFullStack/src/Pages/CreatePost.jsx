import React, { useEffect, useState } from 'react'
import { TextInput, FileInput, Button, Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { set } from 'mongoose'
import {storage, app} from '../firebase';
import {ref, uploadBytes, listAll, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import  uuid  from 'react-uuid';
import { populateUrl } from '../redux/postSlice';
import { useDispatch } from 'react-redux';
import { Line } from 'rc-progress'


function CreatePost() {

    const [video, setVideo] = useState(null)
    const [videoSrc, setVideoSrc] = useState('')
    const [videoName, setVideoName] = useState(null)

    const [formData, setFormData] = useState('')
    const [error, setError] = useState('')

    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)

    const [uploadClicked, setUploadClicked] = useState(false)
    const [videoUploaded, setVideoUploaded] = useState(false)
    
    const [processingVid, setProcessingVid] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    const imagesRef = ref(storage, 'videos/')

    const handleChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.id] : e.target.value
        }))
    }
    const handleFileChange = async (e) => {
        const file = e.target.files[0]; 
        setUploadClicked(false)
        setVideoUploaded(false)
        if(file){
            setVideo(file) 
            console.log(file)
            
        }
    }


    const uploadVideo2 = () => {

        const uniqueFileName = uuid() + video.name;
        const videoRef = ref(storage, `videos/${uniqueFileName}`)

        console.log("fileNameHere: ", uniqueFileName)
        const uploadTask = uploadBytesResumable(videoRef, video)
        setUploadClicked(true)

        try{
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setImageUploadProgress(progress.toFixed(0));

                //   console.log('Upload is ' + progress + '% done');

                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                (error) => {
                  setImageUploadError('Image upload failed');
                  setImageUploadProgress(null);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("downloadUrl: ", downloadURL)
                    setVideoSrc(downloadURL)
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        src: downloadURL
                    }))

                    setImageUploadProgress(null);
                    setImageUploadError(null);
                    setVideoUploaded(true)

                    const file = {
                        filePath: downloadURL,
                        fileName: uniqueFileName
                    }
                    // setProcessingVid(true)
                    console.log("processing....")

                    const res = fetch('/api/posts/thumbnail', {   //getting the thumbnail from uploaded video
                        method: "POST",
                        headers: {"Content-Type" : "application/json"},
                        body: JSON.stringify(file)
                    }).then(res => res.json()).then((data) => {
                        setProcessingVid(false)
                        console.log("processing finished")
                        console.log(data)
                    })
                    
                    
    
                  });
                }
              );
        }catch(error){
            console.log(error.message)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try{
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if(res.ok){
                console.log("ok response from the server")
            }
            if(data){
                console.log(data.message)
            }

            if(!formData || !formData.title || !formData.description || formData.title === '' || formData.description === '' || formData.src === ''){
                console.log("rann")
                console.log(formData)
                setError("All fields are required")
            }     

        }catch(err){
            setError(err.message)
        }
    }


  return (
    <div className='mt-20 flex flex-col items-center gap-10 mx-10 min-h-screen'>
        <div>
            <h1 className='font-bold text-2xl'>Post an Edit</h1>
        </div>

        <div className='w-full max-w-md'>
            <TextInput placeholder='Title here...' id='title' onChange={handleChange}/>
        </div>

        <div className='flex w-full justify-between max-w-md items-center'>
            <FileInput type='file' accept='video/*' onChange = {handleFileChange} className='w-56'/>
            {videoUploaded ? 
            <Alert color="info" className='p-3'>
                Video Uploaded,
            </Alert>
            :
            uploadClicked ? <Line percent={imageUploadProgress} strokeWidth={1} strokeLinecap='round' trailColor='#D3D3D3' trailWidth={1} strokeColor="green" className='h-3 w-48'/> : <Button onClick={uploadVideo2} disabled={video === null}>Upload Video</Button>        
            }
            
        </div>

        {processingVid && <h2>Proccessing Video...</h2>}

        <div className='w-full max-w-md'>
        <textarea placeholder='Description...' name="" id="description" cols="30" rows="10" className='w-full bg-transparent' onChange={handleChange}/>
        </div>

        <div>
            <Button gradientDuoTone='pinkToOrange' type='submit' onClick={handleSubmit}>Upload Post</Button>
        </div>
        
        {error && 
        <Alert color='failure'>
            {error}
        </Alert>
        }

    </div>
  )
}

export default CreatePost;