import React from 'react'
import { Button } from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { signInFail, signInReq, signInSuccess} from '../redux/userSlice'
import {useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';



function Oauth() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = getAuth(app)

    const handleGoogleClick = async () => {
        console.log("clicked")
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account'})
        

        try{
            dispatch(signInReq())
            const googleResponse = await signInWithPopup(auth, provider)
            const userData = googleResponse.user

            const user = {
                username : userData.displayName,
                email: userData.email,
                pfp: userData.photoURL
            }

            const res = await fetch("/api/auth/google", {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify(user)
            })

            const data = await res.json();

            if(res.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }

        }catch(error){
            dispatch(signInFail(error.message))
        }


    }

    return (
        <>
            <Button gradientDuoTone="cyanToBlue" outline onClick={handleGoogleClick}>
                <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
                Continue with Google
            </Button>
        </>
  )
}

export default Oauth