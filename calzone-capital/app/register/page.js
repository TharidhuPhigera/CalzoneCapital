"use client"
import Navbar from '/components/Navbar'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


const Register = () => {
    const [error, setError] = useState("");
    const router = useRouter();
    const isValidEmail = async (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }

    const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{10,}$/;
        return passwordRegex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        const confirmPassword = e.target[2].value;

        if (!isValidEmail(email)) {
            setError("Invalid Email");
            return;
        }

        if (!isValidPassword(password)) {
            setError("Invalid Password.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch("api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            })

            if (res.status === 400) {
                setError("This email is already registered");
            }

            if (res.status === 200) {
                setError("");
                await signIn('credentials', { email, password }, { redirect: false });
                router.push("/");
            }
        } catch (error) {
            setError("Error, try again");
            console.log(error);
        }
    }

  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
        <Navbar style={{ height: 'auto', marginBottom: '20px' }} />
        <div className='flex flex-col items-center'>
            <div className='bg-white p-8 rounded shadow-md w-96'>
                <h1 className='text-black text-4xl text-center font-thin mb-8'>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Email Address' 
                        required
                    />
                    <input 
                        type="password" 
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Password' 
                        required
                    />
                    <input 
                        type="password" 
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Confirm Password' 
                        required
                    />
                    <p className='font-semibold text-gray-800 text-[14px]'>Password requirements:</p>
                    <ul className='text-gray-600 text-[14px] mb-4'>
                        <li>- At least 10 characters</li>
                        <li>- At least 1 uppercase character</li>
                        <li>- At least 1 digit</li>
                        <li>- At least 1 symbol</li>
                    </ul>
                    <button
                        type='submit'
                        className='w-full px-6 py-3 rounded-full bg-[#38bfc3] text-white hover:bg-[#2D9B9E]'>
                    Register</button>
                    <p className='text-red-600 text-[16px] m-2 items-center'>{error && error}</p>
                </form>
                <Link className="block text-center text-[#2D9B9E] hover:underline mt-2" href="/login">
                    Login with an existing account
                </Link>
            </div>
        </div>

    </main>
  )
}

export default Register