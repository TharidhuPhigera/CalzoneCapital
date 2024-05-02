"use client"
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '/components/Sidebar';
import News from '/components/News';
import WatchList from '/components/WatchList';
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
      <TwelveDataWebSocket symbols={['AAPL','INFY','TRP','QQQ','EUR/USD','USD/JPY','BTC/USD','ETH/BTC']} onMessage={handleWebSocketMessage} />
      <div>
        <h2 className='text-2xl mb-2 pt-14 text-[#cb4444]'>Live Price</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 overflow-hidden bg-[#F5F7F8] rounded-md shadow-md">
          {priceData.map((price, index) => (
            <div key={index} className="news-card">
              <div className="w-full h-full rounded-md relative p-6 flex flex-col items-center justify-center">
                <span className="text-[#38bfc3] text-sm md:text-lg xl:text-xl 2xl:text-2xl" style={{ fontSize: price.symbol.length > 5 ? '0.75rem' : '1rem' }}>
                  {price.symbol}
                </span>
                <span className="text-lg md:text-xl 2xl:text-2xl">
                  ${Math.abs(price.price).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
        <div className="flex">
          <News className="w-2/3" />
          <WatchList className="w-1/3" />
        </div>
      </section>
    </main>
  );
}  

export default Home;
