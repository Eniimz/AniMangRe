import { Table } from 'flowbite-react'
import React, { useDeferredValue, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Modal, Button } from 'flowbite-react';
import { HiExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectedPostId } from '../redux/postSlice.js';

export const DashboardEdits = () => {

    const { data : currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [openModal,  setOpenModal] = useState(false)
    const [deleteId, setDeleteId ] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserPosts = async () => {
            const res = await fetch(`/api/posts/edits?userId=${currentUser._id}`)
            const data = await res.json();
            console.log(data.getPosts)
            setUserPosts(data.getPosts);
            
        }
        fetchUserPosts()
    }, [])

    const handleDelete = async (postId) => {
        console.log("Running")
        console.log("ThsDeleteId: ", postId);
        const res = await fetch(`/api/posts/delete/${postId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        window.location.reload();    
    }

  return (
    <div className='p-5 w-full'>
        <Table className=''>
            <Table.Head>
                <Table.HeadCell> Posted At </Table.HeadCell>
                <Table.HeadCell> Post Image </Table.HeadCell>
                <Table.HeadCell> Post title</Table.HeadCell>
                <Table.HeadCell> Delete </Table.HeadCell>
                <Table.HeadCell>
                    <span> Edit </span> 
                </Table.HeadCell>
            </Table.Head>

            {userPosts &&
                userPosts.map((userPost, i) => (
                    <Table.Body key={i}>
                        <Table.Row>
                            <Table.Cell> {new Date(userPost.createdAt).toLocaleDateString()} </Table.Cell>
                            <Table.Cell>
                                <img src={userPost.thumbnailSrc} alt="" className='w-28 h-14'/>
                            </Table.Cell>
                            <Table.Cell> {userPost.title} </Table.Cell>
                            <Table.Cell>
                                <span className='text-red-600 cursor-pointer' onClick={
                                    () => { 
                                        setDeleteId(userPost._id)
                                        return setOpenModal(true)      
                                    }}> Delete </span>
                            </Table.Cell>
                            <Table.Cell>
                                <Link to='/update-post'> <span className='text-blue-500 cursor-pointer' onClick={() => dispatch(selectedPostId(userPost._id))}> Edit </span> </Link>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))
            }

            <Modal show = {openModal} popup size='md'>
                <Modal.Header />
                    <Modal.Body>
                        <div className='flex flex-col gap-3'>
                            <div className='flex items-center justify-center'>
                                <HiExclamationCircle className='w-14 h-14'/>
                                <h3> Are you sure, you want to delete the post? </h3>
                            </div>

                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={() => handleDelete(deleteId)}> Yes </Button>
                                <Button color='gray' onClick={() => setOpenModal(false)}> No </Button>
                            </div>
                        </div>
                    </Modal.Body>
            </Modal>

            
            


        </Table>
    </div>
  )
}
