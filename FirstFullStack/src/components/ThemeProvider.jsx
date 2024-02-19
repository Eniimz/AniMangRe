import React from 'react'
import { useSelector } from 'react-redux'


function ThemeProvider({children}) {
    
    const {mode} = useSelector(state => state.theme)



    return (
        <div className={`${mode} h-full`}>
            <div className='bg-white text-gray-700 dark:bg-[rgb(9,11,20)] dark:text-gray-200 h-full'>
                {children}
            </div>
        </div>
    )
}

export default ThemeProvider