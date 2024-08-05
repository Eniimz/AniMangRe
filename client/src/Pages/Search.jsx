import { set } from 'mongoose';
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns';
import { useLocation, Link } from 'react-router-dom';


const Search = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    const location = useLocation(); 

    useEffect(() => {

        const fetchPosts = async () => {

            try{
                setLoading(true);
                const urlParams = new URLSearchParams(location.search);
                const searchQuery = urlParams.toString();
                setSearchTerm(urlParams.get('searchTerm'));
                const res = await fetch(`/api/posts/edits?${searchQuery}`);
                const data = await res.json();
                setPosts(data.getPosts)
                setLoading(false);
            
            }catch(err){
                console.log(err.message)
            }
        }
        
        fetchPosts();
        console.log("use Effect of Search ran..")
    }, [location.search])

    const AllPosts = posts?.map((post, index) => (

        <div className='flex lg:flex-row vsm:flex-col gap-5 items-start sm:w-fit'>
            <Link to= {`/posts/${post._id}`}><img src={post.thumbnailSrc} alt="thumbnail img" className='sm:w-[450px] sm:h-60 vsm:w-96 vsm:h-56 rounded-md flex flex-1'/></Link>
            <div className='flex flex-col gap-1'>
            <Link to= {`/posts/${post._id}`}><h1 className='lmd:text-2xl font-bold flex flex-1 break-normal'>{post.title.length > 55 ? post.title.slice(0, 55) + '...' : post.title}</h1> </Link>
                <div className='flex items-center gap-3'>
                    <img src={post.pfp} alt="pfp img" className='w-8 h-7 rounded-2xl' />
                    <p className='text-sm lmd::text-md'>{post.postCreator} &#8226; {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                </div>
                    <p className='text-sm lmd::text-lg'>{post.description}</p>
            </div>
        </div>
     

    ))

    return (
        <div className='pt-10 vsm:p-0 sm:p-10 min-h-screen'>

            <div className='xl:items-start vsm:items-center flex flex-col'>

                <h1 className='flex text-3xl font-bold '>{`Search Results for : "${searchTerm}"`}</h1>

                {
                    loading ?

                    <h1 className='mt-10'> Loading... </h1>

                    :
                    <div className='grid grid-cols-1 mt-10 gap-5 vsm:justify-items-center lg:justify-items-start w-full'>
                        {AllPosts.length === 0 ? <h2 className='font-semibold text-lg'> No Posts Found </h2> : AllPosts}
                    </div>
                    
                }

                

            </div>

        </div>
    )
    }
    
export default Search