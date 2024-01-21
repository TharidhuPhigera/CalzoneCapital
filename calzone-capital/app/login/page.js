"use client"
import React, { useEffect, useState } from 'react'
import Link from "next/link"
import Navbar from '/components/Navbar'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

const Login = () => {
 const router = useRouter();
 const [error, setError] = useState("")
 const session = useSession();

 useEffect(() => {
  if (session?.status === "authenticated") {
    router.replace("/home");
  }
}, [session]);


 const isValidEmail = async (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log(email, password)
  
    if (!isValidEmail(email)){
      setError("Invalid Email");
      return;
    }
    if (!password || password.length < 8){
      setError("Invalid Password");
      return;
    }
  
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (res?.ok) {
        setError("");
        router.replace("/home");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("Error signing in. Please try again.");
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <Navbar style={{ height: 'auto', marginBottom: '20px' }} />
      <div className='flex flex-col items-center'>
        <div className='bg-white p-8 rounded shadow-md w-96 mt-8'>
          <h1 className='text-black text-4xl text-center font-thin mb-8'>Login</h1>
          <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name='email'
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Email Address' 
                        required
                    />
                    <input 
                        type="password" 
                        name='password'
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Password' 
                        required
                    />
                    <button
                        type='submit'
                        className='w-full px-6 py-3 rounded-full bg-[#38bfc3] text-white hover:bg-[#2D9B9E]'>
                        Sign In
                    </button>
                    <p className='text-red-600 text-[16px] mb-4'>{error && error}</p>
          </form>
          <div className="text-center text-gray-500 mt-4">- OR -</div>
          <Link className="block text-center text-[#2D9B9E] hover:underline mt-2" href="/register">
            Register Here
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;


