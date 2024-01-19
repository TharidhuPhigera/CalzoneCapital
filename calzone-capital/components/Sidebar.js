"use client"
import Link from 'next/link';
import { FaTachometerAlt, FaBriefcase, FaSearch, FaCogs, FaSignOutAlt } from 'react-icons/fa';
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from 'react';


const FixedWidthEmail = ({ email }) => {
  const [fontSize, setFontSize] = useState('18px');

  useEffect(() => {
    const emailLength = email.length;
    const maxChars = 20;
    const scaleFactor = Math.min(1, maxChars / emailLength);
    const newFontSize = `${15 * scaleFactor}px`;

    setFontSize(newFontSize);
  }, [email]);

  return (
    <span
      className="text-white"
      style={{
        maxWidth: '150px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: fontSize,
      }}
    >
      {email}
    </span>
  );
};

export default function Sidebar({}) {
  const pages = [
    { id: 1, icon: <FaTachometerAlt />, text: "Dashboard", href: "/home"},
    { id: 2, icon: <FaBriefcase />, text: "Portofolio", href: "/portofolio"},
    { id: 3, icon: <FaSearch />, text: "Discover", href: "/market"},
    { id: 4, icon: <FaCogs />, text: "Settings", href: "/settings"},
  ];
  const {data: session} = useSession();
  return (
    <aside className="h-screen w-1/5">
      <nav className="h-full flex flex-col bg-[#38bfc3] shadow-sm relative">
        <div className="p-4 pb-2 flex flex-col items-center">
            <Link href="/">
            <img
                className={`overflow-hidden`}
                src="/images/logo.png"
                alt="logo image"
                width={110}
                height={110}
            />
            </Link>
        </div>
        <ul className="flex-1 px-3">
          {pages.map((page) => (
            <SidebarItem
              key={page.id}
              icon={page.icon}
              text={page.text}
              href={page.href}
            />
          ))}
        </ul>
        <div className="flex items-center ml-4 mb-4">
            <Link href="/profile">
                <img src="/images/profile.png" alt="profile image" className="w-7 h-7 rounded-md" />
            </Link>
            <div className="leading-4 ml-2">
                <Link href="/profile">
                    <FixedWidthEmail email={session?.user?.email || ''} />
                </Link>
            </div>
            <div className="ml-auto pt-1 mr-4">
                <button onClick={() => signOut()} className="text-black">
                <FaSignOutAlt />
                </button>
            </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, href }) {  
  return (
    <Link href={href}>
      <div className={`relative flex items-center pl-8 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        'text-white hover:bg-white hover:text-black'
      }`}>
        {icon}
        <span className='overflow-hidden transition-all w-52 ml-3'>
          {text}
        </span>
      </div>
    </Link>
  );
}
