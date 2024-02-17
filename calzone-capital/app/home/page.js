"use client";
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '/components/Sidebar';
import TrendingStocks from '/components/TrendingStocks';
import News from '/components/News';

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/");
    return null; 
  }

  return (
    <main className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <section className='w-3/4 pl-12 pr-4 pt-4 overflow-y-auto bg-gray'>
        <News />
        {/* <TrendingStocks /> */}
      </section>
    </main>
  );
};

export default Home;