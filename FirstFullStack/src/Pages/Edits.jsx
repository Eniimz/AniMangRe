import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import { Spinner } from 'flowbite-react';
import { formatDistanceToNow } from 'date-fns';
import { selectedPostId } from '../redux/postSlice';


function Edits() {

    const {thumbnailUrl, editDuration} = useSelector(state => state.post);
    

    const [posts, setPosts] = useState([]);
    const [postImages, setPostImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    

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
            return data.pfp;

        }catch(err){
            console.log(err.message)
        }
    }

    const postBox = posts?.map((post, index) => (
        <Link to={`/posts/${post._id}`} key={index} >
        <div className='flex flex-col gap-2 w-fit rounded-lg cursor-pointer' key={uuid()} onClick={() => dispatch(selectedPostId(post._id))}>

            <img src={post.thumbnailSrc} alt="firebase img" className='vsm:h-48 sm:w-96 sm:h-52 lmd:w-72 lmd:h-36 xl:w-80 xl:h-40 rounded-lg'/>
            
            <div className='flex items-center gap-3 sm:px-0 vsm:px-3'>
                <img src={post.pfp} alt="no pfp" referrerPolicy="no-referrer" className='rounded-3xl w-10'/>
                <div className='w-full'>
                    <h3 className='max-w-64 text-md font-semibold'>{post.title}</h3>   
                    <p className='text-sm'> {post.postCreator} &#8226; {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                </div>
            </div>
        </div>  
        </Link>
    ))


  return (
    <div className='min-h-screen' >

        <div className=' flex flex-col sm:px-0 mt-10 lmd:px-20 gap-5 pb-14 items-center'>
            
            <div className=''>
                <h1 className='font-bold text-2xl'>All Edits</h1>
            </div>

            <div className='grid sm:grid-cols-1 lmd:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5 gap-7'>
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

        </div>
  )
}

export default Edits