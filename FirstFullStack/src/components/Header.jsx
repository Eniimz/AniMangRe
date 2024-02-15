import React, { useState } from 'react';
import { FaMoon, FaSearch, FaBars} from "react-icons/fa"
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';


function Header() {

    const [showMenu, setShowMenu] = useState(false)
    const [selectedMenu, setSelecteMenu] = useState([false, false, false])

    const menuSelectStyle = {
        backgroundColor: selectedMenu ? '#0972fe' : ''
    }

    
  return (
    <div className=''>
        <div className='flex items-center p-2 justify-between gap-4 overflow-hidden border-b-2' style={{backgroundColor: 'white'}}>
            <div className='md:ml-4'>
                <Link to = "/" className='text-lg font-bold'>AniMangRe</Link>
            </div>

            <div className='flex items-center rounded-lg border-2'>
                <input type="text" placeholder='Search...' className='p-1 md:h-10 px-3 rounded-l-lg hidden lg:flex'/>
                <button className='bg-white p-3 rounded-2xl md:px-3'> <FaSearch style={{color: 'lightgray'}}/></button>
            </div>

            <div className='md:flex justify-between w-60 hidden gap-3'>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/review">Review</Link>
            </div>


            <div className= "flex mr-5 md:mr-4 w-28 md:w-40 justify-between items-center md:gap-1">
                <button className= "bg-white h-11 px-5 rounded-3xl hidden md:block border-2">
                <FaMoon />    
                </button> 
                <Link to = '/sign-in'>
                <Button gradientDuoTone="pinkToOrange" outline >Sign in</Button>
                </Link>
                <button className=' md:hidden h-10 w-6 ' onClick={() => setShowMenu((prevValue) => !prevValue)} ><FaBars style={{height: '100%', width: '100%', color: 'white'}}/></button>
            </div>

        </div>

        {showMenu &&  <div>
            <ul>
                <li className='p-3' style={menuSelectStyle}>
                    <button onClick={() => setSelecteMenu(prevValue => [...prevValue])}><Link to="/">Home</Link></button>
                </li>
                <li className='p-3' style={menuSelectStyle}>
                    <button onClick={() => setSelecteMenu(prevValue => !prevValue)}><Link to="/about">About</Link></button>
                </li>
                <li className='p-3' style={menuSelectStyle}>
                    <button onClick={() => setSelecteMenu(prevValue => !prevValue)}><Link to="/review">Review</Link></button>
                </li>
            </ul>
        </div>}

    </div>
  )
}

export default Header