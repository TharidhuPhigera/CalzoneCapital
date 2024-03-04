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
            <div className="flex bg-lime-200 rounded-md shadow-md p-2 font-light border border-lime-500 text-lime-500">
                <span className="mr-2">Buy</span>
                {stock.buy}
            </div>
            <div className="flex bg-yellow-200 rounded-md shadow-md p-2 font-light border border-yellow-500 text-yellow-500">
                <span className="mr-2">Hold</span>
                {stock.hold}
            </div>
            <div className="flex bg-red-200 rounded-md shadow-md p-2 font-light border border-red-500 text-red-500">
                <span className="mr-2">Sell</span>
                {stock.sell}
            </div>
            </li>
        ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;

