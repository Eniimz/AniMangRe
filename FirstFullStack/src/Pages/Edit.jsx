import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CommentSection } from '../components/CommentSection';
import { useSelector } from 'react-redux';
import { Rating } from 'flowbite-react';
import { useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner'

export const Edit = () => {

    const [post, setPost] = useState([])

    const { id } = useParams();

    const { overallRating } = useSelector(state => state.post)

    const [res, setRes] = useState('');
    const [isLoading, setIsLoading]  = useState(true);

    const videoRef = useRef(null);

    useEffect(() => {
        const fetchEditDetails = async () => {
            const res = await fetch(`/api/posts/edits?postId=${id}`);
            const data = await res.json();

            // console.log(data.getPosts);
            setPost(data.getPosts);

        }
        fetchEditDetails();
    }, [])

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
          const videoWidth = videoRef.current.videoWidth;
          const videoHeight = videoRef.current.videoHeight;
          console.log('Video resolution:', videoWidth, 'x', videoHeight);
          setIsLoading(false)
          setRes(prevRes => {
            return videoWidth > 720 && videoHeight > 576 && videoWidth < 1370 && videoHeight < 1080 ? "w-[950px]" : "w-[800px]"
          })

          

        }
      };
  return (
    <div className='flex flex-col items-center justify-center sm:p-10'>
        <div className={`flex flex-col w-fit gap-5 rounded-lg items-center ${isLoading && "w-[1000px]"}`}>

                {isLoading &&
                <ThreeDots
                visible={true}
                height="80"
                width="80"
                color="#d76a04"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                /> }
                {post[0] && <video ref={videoRef} onLoadedMetadata={handleLoadedMetadata} controls className={`sm:rounded-lg ${res} ${isLoading ? 'invisible' : 'visible'}`}>
                    <source src={post[0]?.videoSrc} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>}

                <div className='w-full flex items-start justify-between vsm:px-3 sm:px-0'>
                    <div className='flex flex-col '>
                        <h2 className='font-semibold text-lg'>{post[0]?.title}</h2>   
                        {post[0]?.createdAt && <p>{formatDistanceToNow(new Date(post[0]?.createdAt), { addSuffix: true })}</p>}
                    </div>
                    <Rating className=''>
                        <p className='flex font-bold items-center gap-2 mr-2 text-lg'> <Rating.Star className='text-lg'/> {overallRating} / 10</p>
                    </Rating>
                </div>

                {<div className='w-full border-t-2 pt-4 vsm:px-3 sm:px-0'>
                    <h1 className='text-xl font-bold pb-2'>Description</h1>
                    <h2 className=''>{post[0]?.description}</h2>
                </div>}
                
                <CommentSection />

        </div>
    </div>
  )
}
