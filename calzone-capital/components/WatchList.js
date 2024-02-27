import React, { useState, useEffect } from 'react';
import { fetchReccomendations } from '../app/api/stock/stock-api';

const Watchlist = () => {
  const [trendingStocks, setTrendingStocks] = useState([]);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      try {
        const symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOG'];
        const promises = symbols.map(async symbol => {
          return await fetchReccomendations(symbol);
        });
        const responses = await Promise.all(promises);
        const combinedData = responses.reduce((acc, curr) => {
          return [...acc, ...curr];
        }, []);
        setTrendingStocks(combinedData);
        console.log(combinedData);
      } catch (error) {
        console.error('Error fetching trending stocks:', error);
      }
    };

    fetchTrendingStocks();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl mt-2 mb-5 pt-2">Recommended Stocks</h2>
      <div className="bg-[#F5F7F8] rounded-md shadow-md p-4 mb-4">
      <ul>
        {trendingStocks.map((stock, index) => (
            <li className="flex justify-between items-center pt-3 pb-3" key={index}>
            <span className='text-[#38bfc3] text-lg md:text-xl xl:text-2xl 2xl:text-3xl'>{stock.symbol}</span> 
            <div className="flex">
                <span className="text-sm md:text-lg xl:text-xl 2xl:text-2xl mr-2">Buy</span>
                <span className='text-sm md:text-lg xl:text-xl 2xl:text-2xl text-lime-500'>{stock.buy}</span>
            </div>
            <div className="flex">
                <span className="text-sm md:text-lg xl:text-xl 2xl:text-2xl mr-2">Hold</span>
                <span className='text-sm md:text-lg xl:text-xl 2xl:text-2xl text-yellow-500'>{stock.hold}</span>
            </div>
            <div className="flex">
                <span className="text-sm md:text-lg xl:text-xl 2xl:text-2xl mr-2">Sell</span>
                <span className='text-sm md:text-lg xl:text-xl 2xl:text-2xl text-red-500'>{stock.sell}</span>
            </div>
            </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;
