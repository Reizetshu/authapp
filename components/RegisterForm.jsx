'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasError, setHasError] = useState('');

    const router = useRouter();

    const nameHandler = (e) => {
        setName(e.target.value);
    }

    const emailHandler = (e) => {
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        setPassword(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setHasError('All field are necessary.')
            return
        }

        try {

            const resUserExists = await fetch('api/userExists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            const {user} = await resUserExists.json();

            if (user) {
                setHasError('User already exists.');
                return;
            }

            const res = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, email, password
                })
            });

            if (res.ok) {
                const form = e.target;
                form.reset();
                router.push('/')
            } else {
                console.log('User registration failed.')
            }
        } catch (error) {
            console.log('Error during registration: ', error) 
        }
    };

  return (
    <div className='grid place-items-center h-screen'>
        <div className='shadow-lg p-4 rounded-lg border-t-4 
            border-green-400'>
            <h1 className='text=xl font-bold my-4'>Register</h1>


            <form onSubmit={submitHandler} className='flex flex-col gap-3'>
                <input onChange={nameHandler} 
                    type='text' 
                    placeholder='Full Name' />
                <input onChange={emailHandler} 
                    type='text' 
                    placeholder='Email' />
                <input onChange={passwordHandler} 
                    type='password' 
                    placeholder='Password' />
                <button className='bg-green-600 text-white
                    font-bold cursor-pointer px-6 py-2 rounded'>
                    Register
                </button>

                { hasError && (
                    <div className='bg-red-500 text-white w-fit text-sm
                    py-1 px-3 rounded-md mt-2'>
                        {hasError}
                    </div>
                )}
                
                <Link className='text-sm mt-3 text-right' href={'/'}>
                    Already have an account? <span className='underline'>Login</span>
                </Link>
            </form>
        </div>
    </div>
  )
};

export default RegisterForm;