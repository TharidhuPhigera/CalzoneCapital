"use client"
import Navbar from '/components/Navbar'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';


export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !dob || !phoneNumber) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          dob,
          phoneNumber,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/login");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Navbar style={{ height: 'auto', marginBottom: '20px' }} />
      <div className='flex flex-col items-center'>
        <div className='bg-white p-8 rounded shadow-md w-128 mt-8'>
          <h1 className='text-black text-4xl text-center font-thin mb-8'>Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                  placeholder='First Name' 
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                  placeholder='Last Name' 
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="date"
                  onChange={(e) => setDob(e.target.value)}
                  className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                  placeholder='Date of Birth' 
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className='w-full border border-gray-300 text-black rounded px-3 py-2 mb-4 focus:outline-none focus:border-[#38bfc3] focus:text-black'
                  placeholder='Phone Number' 
                />
              </div>
            </div>
            <button
              type='submit'
              className='w-full px-6 py-3 rounded-full bg-[#38bfc3] text-white hover:bg-[#2D9B9E]'>
              Register
            </button>
            {error && (
              <p className='text-red-600 text-[16px]'>{error}</p>
            )}
          </form>
          <Link className="block text-center text-[#2D9B9E] hover:underline mt-2" href="/login">
            Login with an existing account
          </Link>
        </div>
      </div>
  </main>
  )
}
