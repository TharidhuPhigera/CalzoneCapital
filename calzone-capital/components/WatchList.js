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
      <div className="bg-[#F5F7F8] rounded-md shadow-md p-4 mb-4 w-4/5">
        <table className="w-full text-left">
          <tbody>
            {trendingStocks.map((stock, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-semibold text-[#38bfc3] text-xl">{stock.symbol}</td>
                <td className="px-4 py-3 text-lime-600 text-xl">{stock.buy}</td>
                <td className="px-4 py-3 text-yellow-600 text-xl">{stock.hold}</td>
                <td className="px-4 py-3 text-red-600 text-xl">{stock.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Watchlist;

