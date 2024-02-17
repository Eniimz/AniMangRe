import React, { useState } from 'react'
import { Label, TextInput, Button, Alert, Spinner} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom';
import { set } from 'mongoose';
import { signInReq, signInFail, signInSuccess } from '../redux/userSlice';
import { useSelector, useDispatch } from 'react-redux'

function SignIn() {

  const [formData, setFormData] = useState({})
  
  const dispatch = useDispatch()

  const {loading, data, errorMessage} = useSelector((state) => state.user)

  const navigate = useNavigate()

  function handleChange(e){
    setFormData((prevData) => ({...prevData, [e.target.id] : e.target.value.trim()}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.email || !formData.password){
      dispatch(signInFail("All fields are required"))
    }

    try{
      dispatch(signInReq())
      const res = await fetch('/api/auth/signIn', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(data.success === false){
        dispatch(signInFail(data.message))
      }

      // if(!data.authenticated){
      //   setLoading(false)
      //   return setErrorMessage("Email or Password is incorrect")
      // }

      

      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }

    }catch(error){
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
                      <div>
                          <Label value='Your email'/>
                          <TextInput  id="email" type='email' placeholder='Email...' sizing= "md" onChange={handleChange}/>
                      </div>

                      <div>
                          <Label value='Your password'/>
                          <TextInput  id="password" type='password' placeholder='***' sizing= "md" onChange={handleChange}/>
                      </div>

                      <div>
                          <Button gradientDuoTone="pinkToOrange" className='min-w-full' type='submit' disabled = {loading}> {loading ? <Spinner size = "sm"/> : "Sign in"} {loading && <span className='pl-3'>Loading...</span>}</Button>
                      </div>
                      
                      <div className='text-sm'>
                          <span>Dont Have an account?  </span>
                          <Link to = "/sign-up" className='text-blue-500'>Sign up</Link>
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

export default SignIn