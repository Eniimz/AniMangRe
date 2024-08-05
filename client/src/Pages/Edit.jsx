import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CommentSection } from '../components/CommentSection';
import { useSelector } from 'react-redux';
import { Rating } from 'flowbite-react';


export const Edit = () => {

    const [post, setPost] = useState([])

    const { id } = useParams();

    const { overallRating } = useSelector(state => state.post)

    useEffect(() => {
        const fetchEditDetails = async () => {
            const res = await fetch(`/api/posts/edits?postId=${id}`);
            const data = await res.json();

            // console.log(data.getPosts);
            setPost(data.getPosts);

        }
        fetchEditDetails();
    }, [])

  return (
    <div className='flex flex-col items-center justify-center p-10'>
        <div className='flex flex-col w-fit gap-5 rounded-lg items-center'>

                {post[0] && <video width="320" height="110" controls className='rounded-lg w-[1000px]'>
                    <source src={post[0]?.videoSrc} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>}

                <div className='w-full flex items-start justify-between'>
                    <div className='flex flex-col '>
                        <h2 className='font-semibold text-lg'>{post[0]?.title}</h2>   
                        {post[0]?.createdAt && <p>{formatDistanceToNow(new Date(post[0]?.createdAt), { addSuffix: true })}</p>}
                    </div>
                    <Rating className=''>
                        <p className='flex font-bold items-center gap-2 mr-2 text-lg'> <Rating.Star className='text-lg'/> {overallRating} out of 10</p>
                    </Rating>
                </div>

                {<div className='w-full border-t-2 pt-4'>
                    <h1 className='text-xl font-bold pb-2'>Description</h1>
                    <h2 className=''>{post[0]?.description}</h2>
                </div>}
                
                <CommentSection />

        </div>
    </div>
  )
}
