import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react"

const Navbar = () => {
  const { data: session } = useSession()
  return (
    <nav>
      <div className='flex flex-wrap items-center justify-between mx-auto p-8'>
        <Link href="/">
          <img
            src="/images/logo.png"
            alt="logo image"
            width={110}
            height={110}
          />
        </Link>
        <div className='menu hidden md:block md:auto' id="navbar">
          <ul className='p-4 sm:w-fit'>
            {!session ? (
              <>
                <Link href={"/register"}>
                  <button className='px-6 py-3 rounded-full sm:inline-block mr-6 bg-[#38bfc3] text-black hover:bg-transparent hover:text-[#38bfc3] border border-black hover:border-[#38bfc3]'>Get Started</button>
                </Link>
                <Link href={"/login"}>
                  <button className='px-6 py-3 rounded-full sm:inline-block bg-transparent hover:bg-white hover:text-black text-white mt-3'>Log In</button>
                </Link>
              </>
            ) : (
              <div>
                <Link href={"/home"}>
                  <button className='px-6 py-3 rounded-full sm:inline-block mr-6 bg-[#38bfc3] text-black hover:bg-transparent hover:text-[#38bfc3] border border-black hover:border-[#38bfc3]'>Dashboard</button>
                </Link>
                <button onClick={() => {
                  signOut();
                }}
                  className='px-6 py-3 rounded-full sm:inline-block bg-transparent hover:bg-white hover:text-black text-white mt-3'>
                  Logout
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
