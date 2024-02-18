import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import logo from '../assets/logo.png'

export default function SignIn() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10'>
        {/* left side */}
        <div className='flex-1'>
          <Link to="/" className=''>
           <img src={logo} class="h-16" alt="Flowbite Logo" />
          </Link>
          <p className='text-sm mt-5'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex officiis harum vel magni, tenetur neque officia ducimus..</p>
        </div>

        {/* right side */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <h3 className='text-2xl font-bold dark:text-white'>Log In</h3>
            <div>
              <Label value='Your Email'/>
              <TextInput type='text' placeholder='name@company.com' id='username'/>
            </div>
            <div>
              <Label value='Your Password'/>
              <TextInput type='password' placeholder='***********' id='password'/>
            </div>
            <Button type='submit' color='blue' className='w-full mt-2'>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
