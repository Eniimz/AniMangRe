import React, { useEffect, useState } from 'react';
import { FaMoon, FaSearch, FaBars, FaSun} from "react-icons/fa"
import {AiOutlineSearch} from'react-icons/ai'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, DropdownDivider, Navbar, TextInput } from 'flowbite-react';
import { useSelector,useDispatch } from 'react-redux';
import { signOut } from '../redux/userSlice';
import { current } from '@reduxjs/toolkit';
import {toggleMode} from '../redux/theme/themSlice'



function Header() {

    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const {mode} = useSelector(state => state.theme)
    const { data: currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState("")
    const [showSearchBar, setShowSearchBar] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
          setSearchTerm(searchTermFromUrl);
        }
        console.log("use Effect of Header ran")
      }, [location.search]);

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

    const handleSubmit = async (e) => {

        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString(); 
        navigate(`/search?${searchQuery}`)
        console.log("Submit of Search ran");
    }

    

  return (
    <div className=''>
        <Navbar className={`border-b-2`}>
                <div className=''>
                    <Link to = "/" className='text-xl font-bold'>AniMangRe</Link>
                </div>

                <form className='flex' onSubmit={handleSubmit}>
                    <TextInput
                    placeholder='Search..'
                    rightIcon={FaSearch}
                    className='hidden lg:inline'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
                <Button  className='h-10 w-12 lg:hidden flex' color='gray' pill onClick={() => setShowSearchBar(prevValue => !prevValue)}>
                    <AiOutlineSearch className='size-5'/>   
                </Button>

                <div className='flex md:order-2 gap-3'>
                <Button className='h-10 w-12' pill color='gray' onClick={() => dispatch(toggleMode())}>
                    {mode === 'dark' ? <FaMoon /> : <FaSun />}
                </Button>

                {currentUser ? (
                    <Dropdown
                    arrowIcon = {false}
                    inline
                    label = {<Avatar img={currentUser.pfp} rounded/>}
                    >
                        <Dropdown.Header className='flex flex-col'>
                            <span>@{currentUser.username}</span>
                            <span className='font-bold'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to='/dashboard?tab=profile'>
                        <Dropdown.Item> Profile </Dropdown.Item>
                        </Link>
                        <Link to='/create-post'>
                        <Dropdown.Item> Upload Edit </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider/>
                        <Dropdown.Item onClick={handleSignOut}> Sign Out </Dropdown.Item>
                    </Dropdown>
                )
                :
                (
                <Link to='/sign-in'>    
                <Button gradientDuoTone='pinkToOrange' outline >
                    Sign in
                </Button>
                </Link>)
                }
                
                <Navbar.Toggle />
                </div>

                <Navbar.Collapse>
                        <Navbar.Link active = {path === '/'} as={'div'}> 
                            <Link to='/'>Home</Link>
                        </Navbar.Link>

                        <Navbar.Link active = {path === '/Review'} as={'div'}>
                            <Link to='/posts'>Edits</Link>
                        </Navbar.Link >

                        <Navbar.Link active = {path === '/About'} as={'div'}>
                            <Link to='/About'>About</Link>
                        </Navbar.Link>       
                </Navbar.Collapse>

        </Navbar>

        {showSearchBar && 
        <div className='flex dark:bg-gray-900 bg-gray-600 justify-center p-3'>
            <form className='' onSubmit={handleSubmit}>
                        <input type="text" 
                        className='rounded-lg outline-none h-10 text-black'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
            </form>
        </div>}

    </div>
  )
}

export default Header