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

        <div className='flex gap-5 items-start'>
            <Link to= {`/posts/${post._id}`}><img src={post.thumbnailSrc} alt="thumbnail img" className='w-96 h-52 rounded-md'/></Link>
            <div className='flex flex-col gap-2'>
            <Link to= {`/posts/${post._id}`}><h1 className='text-xl font-bold'>{post.title.length > 35 ? post.title.slice(0, 35) + '...' : post.title}</h1> </Link>
                <p className='text-sm'>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                {/* <img src={} alt="pfp img" className='w-8 h-7 rounded-2xl' /> */}
                <p className='text-sm'>{post.description}</p>
            </div>
        </div>
     

    ))

    return (
        <div className='p-10 min-h-screen'>

            <div className=''>

                <h1 className='text-3xl font-bold'>{`Search Results for : "${searchTerm}"`}</h1>

                {
                    loading ?

                    <h1 className='mt-10'> Loading... </h1>

                    :
                    <div className='grid grid-cols-2 flex-wrap mt-10 gap-5'>
                        {AllPosts.length === 0 ? <h2 className='font-semibold text-lg'> No Posts Found </h2> : AllPosts}
                    </div>
                    
                }

                

            </div>

        </div>
    )
    }
    
export default Search