import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

export const Edit = () => {

    const [post, setPost] = useState([])

    const { id } = useParams();

    useEffect(() => {
        const fetchEditDetails = async () => {
            const res = await fetch(`/api/posts/edits?postId=${id}`);
            const data = await res.json();

            console.log(data.getPosts);
            setPost(data.getPosts);

        }
        fetchEditDetails();
    }, [])

    console.log("This is the State post: ", post)

  return (
    <div className='flex flex-col items-center justify-center p-10'>
    <div className='flex flex-col w-fit gap-5 rounded-lg items-center'>

            {post[0] && <video width="320" height="110" controls className='rounded-lg w-[1000px]'>
                <source src={post[0]?.videoSrc} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>}

            <div className='w-full '>
                <h2 className='font-semibold text-lg'>{post[0]?.title}</h2>   
            </div>

            <div className='w-full border-t-2 pt-4'>
                <h1 className='text-xl font-bold pb-2'>Description</h1>
                <h2 className=''>{post[0]?.description}</h2>
            </div>
            
    </div>
    </div>
  )
}
