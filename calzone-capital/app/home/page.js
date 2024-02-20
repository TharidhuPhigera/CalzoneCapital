"use client"
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '/components/Sidebar';
import News from '/components/News';
import TwelveDataWebSocket from '../utils/websocket';

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [priceData, setPriceData] = useState([]);

  if (!session) {
    router.push("/");
    return null;
  }

  const handleWebSocketMessage = (data) => {
    console.log('WebSocket Message in Home:', data);
    if (data.event === 'price') {
      setPriceData((prevData) => {
        const updatedData = [...prevData];
        const existingIndex = updatedData.findIndex((price) => price.symbol === data.symbol);
  
        if (existingIndex !== -1) {
          updatedData[existingIndex] = data;
        } else {
          updatedData.push(data);
        }
  
        return updatedData;
      });
    }
  };

  return (
    <main className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <section className='w-3/4 pl-12 pr-4 overflow-y-auto bg-gray'>
        <TwelveDataWebSocket symbols={['AAPL', 'AMZN', 'MSFT', 'EUR/USD', 'BTC/EUR']} onMessage={handleWebSocketMessage} />
        <div>
          <h2 className='text-2xl mb-2 pt-14 text-[#cb4444]'>Live Price</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden bg-[#F5F7F8] rounded-md shadow-md">
            {priceData.map((price, index) => (
              <div key={index} className="news-card">
                <div className="w-full h-full rounded-md relative p-6">
                  <span className="absolute left-4 top-4 text-[#38bfc3] text-sm md:text-lg xl:text-xl 2xl:text-2xl">
                    {price.symbol}
                  </span>
                  <div className="w-full h-full flex">
                    <span className="mt-6 text-lg md:text-xl 2xl:text-2xl flex items-center">
                      ${Math.abs(price.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <News />
      </section>
    </main>
  );
}  

export default Home;
