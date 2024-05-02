"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '/components/Sidebar';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (session && session.user && session.user.email) {
        const userEmail = session.user.email;
        const flaskApiUrl = `http://localhost:5000/userInfo?email=${encodeURIComponent(userEmail)}`;
        console.log("Fetching data for user email:", userEmail);
        const res = await fetch(flaskApiUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          const formattedDob = new Date(data.dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          setUserData({ ...data, dob: formattedDob });
          console.log("User data fetched:", data);
        } else {
          console.error('Failed to fetch user data', res.status);
        }
      } else {
        console.error('Session or user email not found');
      }
    };

    fetchUserData();
  }, [session]);
  
  const { email, firstName, lastName, dob, phoneNumber } = userData;

  return (
    <main className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />

      <section className="w-4/5 p-10 text-left overflow-y-auto bg-gray">
        <div className="flex justify-between items-start">
          <h1 className=" mb-10 text-4xl pt-14 pl-5">Profile</h1>
        </div>

        <div className="container mx-auto pl-4 rounded-md grid grid-cols-3 gap-8">
          {/* First Column */}
          <div className="flex flex-col space-y-4">
            <div>
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
            <div className="mb-4">
                <label htmlFor="dob" className="text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="text"
                  id="dob"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={dob || ''}
                  disabled
                />
              </div>
          </div>
          {/* Second Column */}
          <div className="flex flex-col space-y-4">
            <div>
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
            <div className="mt-4">
              <label htmlFor="phone" className="text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={phoneNumber || ''}
                disabled
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
  }

export default Profile;
