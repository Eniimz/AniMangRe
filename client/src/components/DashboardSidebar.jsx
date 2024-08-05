import { Sidebar } from 'flowbite-react'
import { useLocation, Link } from 'react-router-dom'
import {HiUser, HiArrowSmRight} from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/userSlice';

import React from 'react'

const DashboardSidebar = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    
    const urlParams = new URLSearchParams(location.search)
    const activeTab = urlParams.get('tab')

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
    <div className='h-full w-full'>
        <Sidebar className='w-full'>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active = {activeTab === 'profile'} icon= {HiUser} label={'User'} labelColor='dark' as='div'>
                    Profile
                </Sidebar.Item>
                </Link>

                <Link to='/dashboard?tab=edits'>
                <Sidebar.Item active = {activeTab === 'edits'}  as='div'>
                    Your edits
                </Sidebar.Item>
                </Link>
        
                <Link>
                <Sidebar.Item as='div' icon= {HiArrowSmRight} onClick={handleSignOut}>
                    Sign out
                </Sidebar.Item>
                </Link>

            </Sidebar.ItemGroup>
        </Sidebar>
    </div>
  )
}

export default DashboardSidebar