"use client"
import Link from 'next/link';
import { FaTachometerAlt, FaBriefcase, FaSearch, FaCogs, FaSignOutAlt, FaUser, FaWallet } from 'react-icons/fa';
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


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

  const {data: session} = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/'); 
  };
  const pages = [
    { id: 1, icon: <FaTachometerAlt />, text: "Dashboard", href: "/home"},
    { id: 2, icon: <FaSearch />, text: "Discover", href: "/market"},
    { id: 3, icon: <FaBriefcase />, text: "Portofolio", href: "/portofolio"},
    { id: 4, icon: <FaWallet />, text: "Wallet", href: "/wallet"},
    { id: 5, icon: <FaUser />, text: "Profile", href: "/profile"}
  ];

  const bottomPages= [
    { id: 5, icon: <FaCogs />, text: "Settings", href: "/settings"},
    { id: 6, icon: <FaSignOutAlt />, text: "Logout", onClick: handleSignOut },
  ]

  return (
    <aside className="h-screen w-1/5">
      <nav className="h-full flex flex-col bg-[#121212] shadow-sm relative">
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
        <ul className="flex-col flex-initial items-center mb-4 px-3">
          {bottomPages.map((page) => (
            <BottomItem
              key={page.id}
              icon={page.icon}
              text={page.text}
              href={page.href}
              onClick={page.onClick}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, href }) {  
  return (
    <Link href={href}>
      <div className={`relative flex items-center pl-8 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        'text-white hover:bg-[#38bfc3] hover:text-black'
      }`}>
        {icon}
        <span className='overflow-hidden transition-all w-52 ml-3'>
          {text}
        </span>
      </div>
    </Link>
  );
}

export function BottomItem({ icon, text, href, onClick }) {
  if (href) {
    return (
      <Link href={href}>
        <div className={`relative flex items-center pl-8 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          'text-white hover:bg-[#38bfc3] hover:text-black'
        }`}>
          {icon}
          <span className='overflow-hidden transition-all w-52 ml-3'>
            {text}
          </span>
        </div>
      </Link>
    );
  } else {
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center pl-8 py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
          'text-white hover:bg-[#38bfc3] hover:text-black'
        }`}
      >
        {icon}
        <span className='overflow-hidden transition-all w-52 ml-3'>
          {text}
        </span>
      </div>
    );
  }
}
