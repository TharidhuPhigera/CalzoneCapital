"use client"
import React from 'react';
import Sidebar from 'components/Sidebar';
import { FaPencilAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();
  console.log("Session:", session);

  const { email, firstName, lastName } = session?.user || {};

  return (
    <main className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />

      <section className="w-4/5 pl-10 pr-4 pt-4 text-left overflow-y-auto bg-gray">
        <div className="flex justify-between items-start">
          <h1 className=" mb-10 text-4xl pt-14 pl-5">Profile</h1>
        </div>

        <div className="container mx-auto pl-4 rounded-md grid grid-cols-3 gap-8">
          {/* First Column */}
          <div className="flex flex-col space-y-4">
            <div className="mb-4">
              <label htmlFor="firstName" className="text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={firstName || ''}
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={lastName || ''}
                disabled
              />
            </div>
          </div>

          {/* Second Column */}
          <div className="flex flex-col space-y-4">
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-700">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={email || ''}
                disabled
              />
            </div>
          </div>

          {/* Third Column */}
          <div className="flex flex-col items-center justify-end">
            <div className="relative mb-4">
              <img
                src="/images/profile.png" 
                alt="profile image"
                className="w-32 h-32 rounded-full"
              />
              <button className="absolute bottom-0 right-0 bg-gray-500 text-white p-2 rounded-full">
                <FaPencilAlt />
              </button>
            </div>
            <button className="bg-[#38bfc3] text-white p-2 rounded-md">
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
