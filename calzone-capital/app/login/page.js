"use client"
import React from 'react'
import Link from "next/link"
import Navbar from '/components/Navbar'
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { signIn } from "next-auth/react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-[#121212]">
      <Navbar style={{ height: 'auto', marginBottom: '20px' }} />
      <div className='flex flex-col items-center'>
        <div className='bg-white p-8 rounded shadow-md w-96 mt-8'>
          <h1 className='text-black text-4xl text-center font-thin mb-8'>Login</h1>
          <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Email Address' 
                    />
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                        placeholder='Password' 
                    />
                    <button
                        type='submit'
                        className='w-full px-6 py-3 rounded-full bg-[#38bfc3] text-white hover:bg-[#2D9B9E]'>
                        Sign In
                    </button>
                    {error && <p className="text-red-600 text-[16px] mt-2">{error}</p>}
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


