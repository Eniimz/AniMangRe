import React, { useEffect, useState } from 'react';
import { Textarea, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { addISOWeekYears } from 'date-fns';
import { FaThumbsUp } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { Rating } from 'flowbite-react';

export const CommentSection = () => {

  const { data : currentUser } = useSelector((state) => state.user);
  const { postId } = useSelector(state => state.post)

  const [flag, setFlag] = useState(false);
  
  const [filled, setFilled] = useState(Array(10).fill(false));

  const [commentData, setCommentData] = useState({
      username: currentUser.username,
      postId,
      pfp: currentUser.pfp, 
      comment: '',  
      userId: currentUser._id
    
  });

  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);

  const [error, setError] = useState('')

    // console.log("Total Comments: ", totalComments);
    // console.log("PostId here: ",postId)



  useEffect(() => {
    
    const getPostComments = async () => {
      try{

        const res = await fetch(`/api/comments/getComments?postId=${postId}`);
        const data = await res.json();
  
        console.log(data);

        setComments(data.comments);
        setTotalComments(data.totalComments);
  
      }catch(err){
        console.log(err)
      }
  
    }

    getPostComments();

  }, [flag]) 

  


  const handleChange = (e) => {
    setCommentData((prevData) => (
      {
        ...prevData,
        [e.target.id] : e.target.value
      }
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(commentData.comment.length == 0){
      setError("Review empty..")
    }

    try{
      
      const res = await fetch('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(commentData)
      })

      const data = await res.json();

      console.log(data)

      if(res.ok){

        setCommentData(prevData => ({
          ...prevData,
          comment: ''
        }))

      }

      setFlag(prevValue => !prevValue);

      console.log(countStars());

    }catch(err){
      console.log(err.message)  
    }
  }

  const handleDelete = async (commentId) => {

    try{

      const res = await fetch(`/api/comments/delete/${commentId}`,{
        method: 'DELETE'
      })

      const data = await res.json();
      
      console.log(data)
      
      setFlag(prevValue => !prevValue);


    }catch(err){
      console.log(err.message)
    }

  }


  const handleRating = (lastStarIndex) => {

    setFilled(prevFilled => {
      prevFilled.fill(false);
      return prevFilled.map((starFillValue, index) => {

        if(index <= lastStarIndex){
          return starFillValue = !starFillValue
        }else{
          return starFillValue;
        }

      })
    })

  }

  const countStars = () => {

    const stars = filled.filter(value => value === true);

    const starsCount = stars.length;

    return starsCount;

  }

  

  return (
    <div className='w-full p-3 flex flex-col gap-3'>

      <p className='flex gap-2 text-sm'>
        Signed in as  <img src={currentUser.pfp} className='rounded-3xl w-7'/><span className='text-blue-300'> @{currentUser.username} </span>
      </p>

      <form className='flex flex-col gap-5 border rounded-lg border-gray-300 p-3' onSubmit={handleSubmit}>
        <Textarea placeholder='Add a review...' rows='3' maxLength='200' id='comment' onChange={handleChange} value={commentData.comment} />

        <div className='flex items-center justify-between'>
          <p className='text-sm'>
            <Rating className='rounded-lg p-1 flex gap-1'>

              <Rating.Star filled= {filled[0]} onClick={() => handleRating(0)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[1]} onClick={() => handleRating(1)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[2]} onClick={() => handleRating(2)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[3]} onClick={() => handleRating(3)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[4]} onClick={() => handleRating(4)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[5]} onClick={() => handleRating(5)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[6]} onClick={() => handleRating(6)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[7]} onClick={() => handleRating(7)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[8]} onClick={() => handleRating(8)} className='cursor-pointer'/>
              <Rating.Star filled= {filled[9]} onClick={() => handleRating(9)} className='cursor-pointer'/>
        
            </Rating>  
          </p>  
          <Button gradientDuoTone= 'cyanToBlue' outline type='submit'> Submit </Button>
        </div>
        
      </form>

      <p className='flex gap-1'>
          Comments
        <span className='border px-2'>{ totalComments }</span>
      </p>

      <div className='flex flex-col px-8 gap-2 mt-4'>
        {
          comments.map((comment, index) => (
            <div className='flex gap-2 border-b border-gray-700 pb-5' key={index}>

              <div className='flex'>
                <img src={comment.pfp}  className='w-8 h-8 rounded-3xl mt-3'/>
              </div>

              <div className='flex flex-1 flex-col'>
                <div className='flex gap-2 mb-1 items-center'>
                  <p className='font-bold text-sm'>@{comment.username}</p>
                  <p className='text-sm text-gray-300'>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                </div>

                <p className='font-normal text-gray-400'> {comment.comment} </p>

                <div className='mt-2 flex items-center gap-2 border-gray-500 border-t pt-2 w-fit'>
                  <div className='flex items-center gap-2 text-sm'> <FaThumbsUp className='w-3'/>{}</div>
                    {comment.userId == currentUser._id &&
                    <div className='flex gap-2 items-center'> 
                      <p className='text-sm cursor-pointer text-gray-500 font-medium hover:text-blue-300' >Edit</p>
                      <p className='text-sm cursor-pointer text-gray-500 font-medium hover:text-red-400' onClick={() => handleDelete(comment._id)}>
                        Delete</p> 
                      <p></p>
                    </div>}
                </div>

              </div>

            </div>

          ))
        }
      </div>

    </div>
  )
}
