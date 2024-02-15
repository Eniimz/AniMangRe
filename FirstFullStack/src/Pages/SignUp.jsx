import React, { useState } from 'react'
import { Label, TextInput, Button, Alert, Spinner} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom';




function SignUp() {

    const [formData, setFormData] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleChange(e){
          setFormData((prevData) => ({...prevData, [e.target.id] : e.target.value.trim()}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null)

        if( !formData.username || !formData.email || !formData.password){
            return setErrorMessage("Please fill out all fields")
        }
        setLoading(true)

        console.log("outside try ran")
    try{
            const res = await fetch('/api/auth/signUp', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json'},
            body : JSON.stringify(formData)
        })
        const data = await res.json(); //the data here is the response that we send from the server
        setLoading(false)
        if(data.success === false){
            setLoading(false)
            return setErrorMessage(data.message)
        }

        if(res.ok){
            navigate('/sign-in')
        }
    
    } catch(error){
        console.log(error.message)
    }

    }

  return (
    <>
    <div className=' flex justify-center mt-20 '>

        <div className='flex flex-col md:flex md:flex-row gap-5 items-center max-w-3xl  p-3'>

            <div className='flex flex-1 flex-col gap-3'> 
                <h3 className='text-4xl font-bold'>AniMangRe</h3>
                <p className='text-sm max-w-md'>This is a demo project, You can Sign up with your email and password or through Google</p>
            </div>
            

            <div className='flex flex-1 w-full'>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 '>
                        <div className=''>
                            <Label value='Your Username'/>
                            <TextInput  id="username" type='text' placeholder='Username...' sizing= "md"  onChange={handleChange}/>
                        </div>

                        <div>
                            <Label value='Your email'/>
                            <TextInput  id="email" type='email' placeholder='Email...' sizing= "md" onChange={handleChange}/>
                        </div>

                        <div>
                            <Label value='Your password'/>
                            <TextInput  id="password" type='password' placeholder='***' sizing= "md" onChange={handleChange}/>
                        </div>

                        <div>
                            <Button gradientDuoTone="pinkToOrange" className='min-w-full' type='submit' disabled = {loading}> {loading ? <Spinner size = "sm"/> : "Sign up"} {loading && <span className='pl-3'>Loading...</span>}</Button>
                        </div>
                        
                        <div className='text-sm'>
                            <span>Have an account?  </span>
                            <Link to = "/sign-in" className='text-blue-500'>Sign in</Link>
                        </div>

                        {errorMessage && 
                        <div>
                            <Alert color="failure">
                                {errorMessage}
                            </Alert>
                        </div>}

                    </div>
                </form>

                
            </div>

        </div>

    </div>
    </>
  )
}

export default SignUp