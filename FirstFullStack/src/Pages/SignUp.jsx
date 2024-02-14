import React from 'react'
import { Label, TextInput, Button} from 'flowbite-react'
import { Link } from 'react-router-dom';


function SignUp() {
  return (
    <>
    <div className=' flex justify-center mt-20 '>

        <div className='flex flex-col md:flex md:flex-row gap-5 items-center max-w-3xl  p-3'>

            <div className='flex flex-1 flex-col gap-3'> 
                <h3 className='text-4xl font-bold'>AniMangRe</h3>
                <p className='text-sm max-w-md'>This is a demo project, You can Sign up with your email and password or through Google</p>
            </div>
            

            <div className='flex flex-1 w-full'>
                <form className='w-full '>
                    <div className='flex flex-col gap-4 '>
                        <div className=''>
                            <Label value='Your Username'/>
                            <TextInput  id="username" type='username' placeholder='Username...' sizing= "md" required/>
                        </div>

                        <div>
                            <Label value='Your email'/>
                            <TextInput  id="email" type='email' placeholder='Email...' sizing= "md" required/>
                        </div>

                        <div>
                            <Label value='Your password'/>
                            <TextInput  id="email" type='email' placeholder='***' sizing= "md" required/>
                        </div>

                        <div>
                            <Button gradientDuoTone="pinkToOrange" className='min-w-full'>Sign Up</Button>
                        </div>
                        
                        <div className='text-sm'>
                            <span>Have an account?  </span>
                            <Link to = "/sign-in" className='text-blue-500'>Sign in</Link>
                         </div>

                    </div>
                </form>

                
            </div>

        </div>

    </div>
    </>
  )
}

export default SignUp