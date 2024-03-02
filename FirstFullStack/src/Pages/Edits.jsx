import React, { useEffect, useState } from 'react';



function Edits() {

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
        <div className='flex flex-col gap-2 border-2 border-teal-200 rounded-lg'>
            <video width="320" height="110" controls className='rounded-lg'>
                <source src={post.src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
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

        <img src="" alt="" />

    </div>
  )
}

export default Edits