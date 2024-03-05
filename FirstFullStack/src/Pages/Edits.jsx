import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';



function Edits() {

    const {thumbnailUrl, editDuration} = useSelector(state => state.post);
    console.log("ThumbnailUrl : ",thumbnailUrl)
    console.log("Duration: ", editDuration)

    const [posts, setPosts] = useState([])

    console.log("posts: ", posts)

    useEffect( () => {

        async function fetchPosts(){
            try{
                const res = await fetch('/api/posts/edits')
                const data = await res.json();
                setPosts(data.getPosts)
            }catch(err){
                console.log(err.message)
            }
        }

        fetchPosts();

    },[])


    const postBox = posts.map((post) => (
        <div className='flex flex-col gap-2 border-2 w-fit border-teal-200 rounded-lg' key={uuid()}>
            <video width="320" height="110" controls className='rounded-lg'>
                <source src={post.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <img src={post.thumbnailSrc} alt="firebase img"  className='w-80'/>
            <div>
                <h3>{post.title}</h3>
            </div>
        </div>
    ))


  return (
    <div className='min-h-screen'>
        <div className='mt-10 px-20 flex flex-wrap gap-5'>
            {postBox}
        </div>
    </div>
  )
}

export default Edits