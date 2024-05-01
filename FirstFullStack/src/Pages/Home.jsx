import React, { useEffect, useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from 'react-redux';
import { selectedPostId } from '../redux/postSlice';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Rating } from 'flowbite-react';
import { FaFire } from 'react-icons/fa'



function Home() {

  const [posts, setPosts] = useState([]);

  const [sortPosts, setSortPosts] = useState([]);

  

  const dispatch = useDispatch();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1
      
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  

  useEffect(() => {
    const fetchPosts = async () => {
      try{
        const res = await fetch('/api/posts/edits');
        const data = await res.json();

        setPosts(data.getPosts);

      }catch(err){
        console.log(err.message)
      }
    }
    fetchPosts();

  }, [])

    useEffect(() => {
      setSortPosts((prevPosts) => {

        const newArray = [];

        posts.map((post) => newArray.push(post));

        newArray.sort((a, b) => b.rating - a.rating);

        return newArray;
    
      })

    }, [posts])

  console.log("SortedPosts: ", sortPosts)

  return (
    <div className='min-h-screen'>

      <div className='flex flex-col mt-5 p-10 gap-5'>
              
              <div className='flex items-center gap-4 justify-center'>
                <h1 className='font-bold text-2xl'> Top edits </h1>
                <FaFire size={20} />
              </div>

              <div className= 'flex gap-9 justify-center'>
                    {sortPosts[0] && 
                    <div className='rounded-lg'> 
                      <video width="320" height="110" loop = {true}  autoPlay = {true} muted = {true} className='rounded-lg w-[400px] h-[300px]'>
                            <source src={sortPosts[0]?.videoSrc} type="video/mp4"/>
                            Your browser does not support the video tag.
                      </video>

                    </div>}
                    {sortPosts[1] && 
                    <video width="320" height="110" loop = {true} autoPlay = {true} muted = {true} className='rounded-lg w-[400px] h-[300px]'>
                          <source src={sortPosts[1]?.videoSrc} type="video/mp4"/>
                          Your browser does not support the video tag.
                    </video>}

                    {sortPosts[2] && 
                    <video width="320" height="110" loop = {true} autoPlay = {true} muted = {true} className='rounded-lg w-[400px] h-[300px]'>
                          <source src={sortPosts[2]?.videoSrc} type="video/mp4"/>
                          Your browser does not support the video tag.
                    </video>}
              </div>

      </div>

      <div className=' pt-0 p-10 flex flex-col gap-5'>
        <div>
          <h1 className='font-bold text-xl'>Recent Edits</h1>
        </div>
        <Carousel responsive={responsive} className=''>
          {
            posts?.map((post, i) => (
              <Link to = {`/posts/${post._id}`}>  
                <div className='w-full' onClick={() =>dispatch(selectedPostId(post._id))}>
                  <img src={post?.thumbnailSrc} alt="" className='w-64 h-40 rounded-lg'/>

                  <div className='w-full mt-2'>
                    <Rating>
                      <div className='flex flex-1 justify-between pr-3'>
                        <p className='px-1'>{post?.title.length > 40  ? `${post?.title.slice(0, 40)}...` : post?.title}</p>
                        {/* <p className='text-sm flex'> <Rating.Star  className = 'text-sm'/> {post?.rating} </p> */}
                      </div>
                    </Rating>
                    <p className='px-1 text-sm'>{formatDistanceToNow(new Date(post.createdAt), {addSuffix: true})}</p>
                  </div>

                </div>
              </Link>
            ))
          }
        </Carousel>
      </div>


      <div className='flex flex-col gap-5 pt-0 p-10'>

        <div className=''>
          <h1 className='font-bold text-xl' > Highest Rated </h1>
        </div>

        <Carousel responsive = {responsive}>

          {
            sortPosts?.map((post, id) => (

              <Link to = {`/posts/${post._id}`}>  
                <div className='w-full' onClick={() =>dispatch(selectedPostId(post._id))}>
                  <img src={post?.thumbnailSrc} alt="" className='w-64 h-40 rounded-lg'/>

                  <div className='w-full mt-2'>
                    <Rating>
                      <div className='flex flex-1 justify-between pr-3'>
                        <p className='px-1'>{post?.title.length > 40  ? `${post?.title.slice(0, 40)}...` : post?.title}</p>
                        {/* <p className='text-sm flex'> <Rating.Star  className = 'text-sm'/> {post?.rating} </p> */}
                      </div>
                    </Rating>
                    <p className='px-1 text-sm'>{formatDistanceToNow(new Date(post.createdAt), {addSuffix: true})}</p>
                  </div>

                </div>
              </Link>

            ))
          }

        </Carousel>

      </div>

    </div>
  )
}

export default Home