import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { Spinner } from 'flowbite-react';
import { formatDistanceToNow } from 'date-fns';



function Edits() {

    const {thumbnailUrl, editDuration} = useSelector(state => state.post);
    console.log("ThumbnailUrl : ",thumbnailUrl)
    console.log("Duration: ", editDuration)

    const [posts, setPosts] = useState([]);
    const [postImages, setPostImages] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setLoading(false)
        }
        
        fetchPosts();

    },[])

    useEffect(() => {
        async function fetchPostImages(){

            const imageUrls = []

            for (const post of posts){

                const imageUrl = await getImage(post.userId);
                imageUrls.push(imageUrl)

            }
            
            setPostImages(imageUrls)
            
        }

        fetchPostImages();
    }, [posts])

    const getImage = async (id) => {
        const userId = {
            userId: id
        }
        try{
            const res = await fetch("/api/posts/getPfp", {
                method: 'POST',
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify(userId)
            })

            const data = await res.json();

            if(!res.ok){
                console.log("error occured")
            }
            console.log(data)
            return data.pfp;

        }catch(err){
            console.log(err.message)
        }
    }

    const postBox = posts.map((post, index) => (
        <Link to={`/posts/${post._id}`} >
        <div className='flex flex-col gap-2 w-fit rounded-lg cursor-pointer' key={uuid()}>

            <img src={post.thumbnailSrc} alt="firebase img" className='w-80 h-40 rounded-lg'/>
            
            <div className='flex items-center gap-3'>
                <img src={postImages[index]} alt="" referrerPolicy="no-referrer" className='rounded-3xl w-10'/>
                <div className='w-full'>
                    <h3 className='max-w-64'>{post.title}</h3>   
                    <p className='text-sm from-neutral-100'>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                </div>
            </div>
        </div>  
        </Link>
    ))


  return (
    <div className='min-h-screen'>
        <div className='mt-10 px-20 flex flex-wrap gap-5'>
            {  
            loading ?
            <div className='flex justify-center w-full'>
                <Spinner size='xl'/>
            </div>
            :
            postBox
            }
        </div>
    </div>
  )
}

export default Edits