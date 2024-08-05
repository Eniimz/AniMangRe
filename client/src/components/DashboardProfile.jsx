import React, { useState } from 'react'
import { TextInput, Button, Alert, Spinner, Avatar, Modal } from 'flowbite-react'
import {signInReq, signInSuccess, signInFail, updateReq, updateSuccess, updateFail, deleteReq, deleteSuccess, deleteFail, signOut} from '../redux/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { AiFillDatabase } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export const DashboardProfile = () => {

    const {loading, data, errorMessage: updateError} = useSelector(state => state.user)
    const dispatch = useDispatch();
    const {data: currentUser} = useSelector(state => state.user)
    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate()


    const [formData, setFormData] = useState({})


    const handleChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.id] : e.target.value.trim()
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        dispatch(updateReq())

        if(Object.keys(formData).length === 0){
            dispatch(updateFail("No updates were made"))
        }

        try{
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(formData)
            })

            const data = await res.json(); //if no res is sent from the server, then we cant use res.json() or res.ok

            // Here we get the user data from the server response:
            // - First we get user data from the database
            // - Secondly we send that data as a response to the client from the server
            // - finally, data is received here, which is then passed to the redux state of user (data renamed as currentUser)
            // - when this data is stored in the global state, it can then be used for various purposes
            //             -displaying of Avatar
            //             -populating various places with the data such as username, email, images
            
            if(res.ok){     
                dispatch(updateSuccess(data))
            }
            
        }catch(err){
            dispatch(updateFail(err.message))
        }

    }

    const handleDelete = async () => {

        try{
            dispatch(deleteReq())
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method: 'DELETE'
            })

            const data = res.json()

            if(res.ok){
                dispatch(deleteSuccess())
                navigate('/')
            }

        }catch(error){
            dispatch(deleteFail(error.message))
            console.log(error.message)
        }
    }

    const handleSignOut = async () => {

        try{
            const res = await fetch('/api/auth/signOut', {
                method: 'POST'
            })

            if(res.ok){
                dispatch(signOut())
                navigate('/')
            }
        }catch(error){
            console.log(error.message)
        }
    }
    
    return (
        <div className='mt-10 flex flex-col items-center gap-3 w-full'>
            <h1 className='text-gray font-semibold text-3xl'>Profile</h1>
            <div className='h-20 w-20'>
                <img src={currentUser.pfp} alt="pfp" className='rounded-full border-gray-300 border-8' />
            </div>
            <form className='w-full max-w-lg flex flex-col gap-3' onSubmit={handleSubmit}>
                {updateError && <Alert color='failure'> {updateError} </Alert>}
                <TextInput type='text' id="username" placeholder='username' defaultValue={currentUser.username} onChange= {handleChange}/>
                <TextInput type='email' id="email" placeholder='email' defaultValue={currentUser.email} onChange= {handleChange}/>
                <TextInput type='password' id='password' placeholder='password' onChange= {handleChange}/>
                <Button gradientDuoTone='purpleToBlue' type='submit' outline>Update {loading && <Spinner/>}</Button>

                <div className='text-red-500 flex justify-between'>
                    <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete account</span>
                    <span className='cursor-pointer' onClick={handleSignOut}>Sign out</span>
                </div>

            </form>

            <Modal show={showModal} size='md' popup onClose={() => setShowModal(false)}>
                <Modal.Header />
                <div className='px-9 flex flex-col items-center gap-2'>
                    <HiOutlineExclamationCircle className='h-14 w-14'/>
                    <div className='w-full items-center flex justify-center'>
                        <h3>Are you sure you want to delete the account?</h3>
                    </div>

                    <div className=' mt-3 px-5 flex justify-between w-full flex-wrap'>
                        <Button color='failure' onClick={handleDelete}> Yes, I'm Sure </Button>
                        <Button onClick={() => setShowModal(false)}> No, cancel </Button>
                    </div>
                </div>
                <Modal.Footer />
            </Modal>

        </div>
  )
}
