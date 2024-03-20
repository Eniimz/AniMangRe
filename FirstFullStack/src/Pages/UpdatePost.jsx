import React, { useEffect, useState } from 'react'
import { TextInput, FileInput, Button, Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { set } from 'mongoose'
import {storage, app} from '../firebase';
import {ref, uploadBytes, listAll, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import  uuid  from 'react-uuid';
import { populateUrl, populateDuration } from '../redux/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'rc-progress';
import { ThreeDots } from 'react-loader-spinner'


function UpdatePost() {

    const {thumbnailUrl, editDuration} = useSelector(state => state.post);

    const [video, setVideo] = useState(null)
    const [videoSrc, setVideoSrc] = useState('')
    const [videoName, setVideoName] = useState(null)

    const [error, setError] = useState('')

    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)

    const [uploadClicked, setUploadClicked] = useState(false)
    const [videoUploaded, setVideoUploaded] = useState(false)
    
    const [processingVid, setProcessingVid] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { postId } = useSelector((state) => state.post);
    const [ oldData, setOldData ] = useState({});


    useEffect(() => {
        const getPostData = async () => {
            try{
                const res = await fetch(`/api/posts/edits?postId=${postId}`);
                const data = await res.json();
                setOldData(data.getPosts[0]);
                console.log(data);
            }catch(err){
                console.error(err.message);
            }
        }

        getPostData();

    }, [])


    const handleChange = (e) => {
        setOldData((prevOldData) => ({
            ...prevOldData,
            [e.target.id] : e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        console.log("clicked")
        
        if(!oldData || oldData.title === '' || !oldData.title){
            return setError("Title not added")
        }
        
        try{
            console.log("trying the fecth update with the id: ", postId)
            const res = await fetch(`/api/posts/update/${postId}`, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(oldData)
            })

            const data = await res.json()
            console.log("fetch donneeee")
            if(res.ok){
                console.log("ok response from the server")
            }
            if(data){
                console.log(data.message)
            }

            if(!oldData || !oldData.title || !oldData.description || oldData.title === '' || oldData.description === '' || oldData.src === ''){
                console.log("rann")
                console.log(oldData)
                setError("All fields are required")
            }     

        }catch(err){
            setError(err.message)
        }

        navigate('/posts');
    }

  return (
    <div className='mt-20 flex flex-col items-center gap-10 mx-10 min-h-screen'>
        <div>
            <h1 className='font-bold text-2xl'>Update Edit</h1>
        </div>

        <div className='w-full max-w-md'>
            <TextInput placeholder='Title here...' id='title' onChange={handleChange} defaultValue={oldData?.title}/>
        </div>

        <div className='w-full max-w-md'>
        <textarea placeholder='Description...' defaultValue={oldData?.description} name="" id="description" cols="30" rows="10" className='w-full bg-transparent' onChange={handleChange}/>
        </div>

        <div>
            <Button gradientDuoTone='pinkToOrange' type='submit' onClick={handleSubmit} className='mb-9'>Update Post</Button>
        </div>

    </div>
  )
}

export default UpdatePost;  