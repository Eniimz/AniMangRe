import React, { useState } from 'react'
import { TextInput, FileInput, Button, Alert } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { set } from 'mongoose'

function CreatePost() {

    const [videoSrc, setVideoSrc] = useState('')
    const [formData, setFormData] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.id] : e.target.value,
            src: videoSrc
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const videoURL = URL.createObjectURL(file)
            setVideoSrc(videoURL)
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()
        setError(null)

        try{
            const res = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if(!res.ok){
                setError(data.message)
            }
            if(res.ok){
                navigate('/')
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

        <div className='flex w-full justify-between max-w-md'>
            <FileInput type='file' accept='video/*' onChange = {handleFileChange} src={videoSrc}/>
            <Button>Upload Video</Button>
        </div>

        <div className='w-full max-w-md'>
        <textarea placeholder='Description...' name="" id="description" cols="30" rows="10" className='w-full bg-transparent' onChange={handleChange}/>
        </div>

        <div>
            <Button gradientDuoTone='pinkToOrange' type='submit' onClick={handleClick}>Upload Post</Button>
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