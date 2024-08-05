import React, { useEffect, useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from 'react-redux';
import { selectedPostId } from '../redux/postSlice';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Rating, Spinner } from 'flowbite-react';
import { FaFire } from 'react-icons/fa'
import { ThreeDots } from 'react-loader-spinner'




function Home() {

  const [posts, setPosts] = useState([]);

  const [sortPosts, setSortPosts] = useState([]);

  const [isLoading, setIsLoading] = useState(Array(3).fill(true));

  const dispatch = useDispatch();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1302 },  // 1024 - 3000
      items: 4,
      slidesToSlide: 1  
    },
    tablet: {
      breakpoint: { max: 1302, min: 982 }, // 464 - 1024
      items: 3
    },
    largemobile: {
      breakpoint: { max: 982, min: 585 },
      items: 2
    },
    smalllMobile: {
      breakpoint: { max: 585, min: 0},
      items: 1
    }
  };

  

  useEffect(() => {
    const fetchPosts = async () => {
      try{
        const res = await fetch('/api/posts/edits');
        const data = await res.json();

        setPosts(data.getPosts);

        setSortPosts((prevPosts) => {

          const newArray = [];
  
          data.getPosts.map((post) => newArray.push(post));
  
          newArray.sort((a, b) => b.rating - a.rating);
  
          return newArray;
      
        })

      }catch(err){
        console.log(err.message)
      }
    }
    fetchPosts();

  }, [])

  console.log("SortedPosts: ", sortPosts)

  const handleLoadedMetaData = (index) => {
    setIsLoading((prevValue) => prevValue.map((post, i) => i === index ? false : post))
    console.log("Loading array: ", isLoading)
  }

  return (
    <div className='min-h-screen items-center'>

      <div className='flex flex-col mt-5 p-10 gap-5 items-center'>
              
              <div className='flex items-center gap-4 justify-center'>
                <h1 className='font-bold text-2xl'> Top edits </h1>
                <FaFire size={20} />
              </div>

              {isLoading.some(postLoading => postLoading === true) && 
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
                {
                <div className= 'gap-0 flex flex-col lg:flex-row lg:gap-5 justify-center items-center'>
                    {sortPosts[0] && 
                    <div className='rounded-lg flex-1'> 
                      <video width="320" height="110" loop = {true} onLoadedMetadata={() => handleLoadedMetaData(0)} autoPlay = {true} muted = {true} className={`rounded-lg w-[400px] h-[300px] ${isLoading.some(postLoading => postLoading === true) ? 'invisible' : 'visible'}`}>
                            <source src={sortPosts[0]?.videoSrc} type="video/mp4"/>
                            Your browser does not support the video tag.
                      </video>

                    </div>}
                    {sortPosts[1] && 
                    <div className='rounded-lg flex-1'>
                      <video width="320" height="110" loop = {true} onLoadedMetadata={() => handleLoadedMetaData(1)} autoPlay = {true} muted = {true} className={`rounded-lg w-[400px] h-[300px] ${isLoading.some(postLoading => postLoading === true) ? 'invisible' : 'visible'}`}>
                            <source src={sortPosts[1]?.videoSrc} type="video/mp4"/>
                            Your browser does not support the video tag.
                      </video>
                    </div>
                    }

                    {sortPosts[2] && 
                    <div className='rounded-lg flex-1'> 
                      <video width="320" height="110" loop = {true} onLoadedMetadata={() => handleLoadedMetaData(2)} autoPlay = {true} muted = {true} className={`rounded-lg w-[400px] h-[300px] ${isLoading.some(postLoading => postLoading === true) ? 'invisible' : 'visible'}`}>
                            <source src={sortPosts[2]?.videoSrc} type="video/mp4"/>
                            Your browser does not support the video tag.
                      </video>
                    </div>
                    }
              </div>}

      </div>

      <div className=' pt-0 p-10 flex flex-col gap-5'>
        <div>
          <h1 className='font-bold text-xl'>Recent Edits</h1>
        </div>
        { posts.length === 0 ?

          <Spinner size='lg'/>
          :
         <Carousel responsive={responsive} className=''>
          {
            posts?.map((post, i) => (
              <Link to = {`/posts/${post._id}`}>  
                <div className='w-full vsm:ml-0' onClick={() =>dispatch(selectedPostId(post._id))}>
                  <img src={post?.thumbnailSrc} alt="" className='w-60 h-32 md:w-72 md:h-40 rounded-lg'/>

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
        </Carousel>}
      </div>


      <div className='flex flex-col gap-5 pt-0 p-10'>

        <div className=''>
          <h1 className='font-bold text-xl' > Highest Rated </h1>
        </div>

        {posts.length === 0 ?

          <Spinner size='lg'/>
          :
          <Carousel responsive = {responsive}>

          {
            sortPosts?.map((post, id) => (

              <Link to = {`/posts/${post._id}`}>  
                <div className='w-full vsm:ml-0' onClick={() =>dispatch(selectedPostId(post._id))}>
                  <img src={post?.thumbnailSrc} alt="" className='w-60 h-32 md:w-72 md:h-40 rounded-lg'/>

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
}
      </div>

    </div>
  )
}

export default Home