import React, { useState, useEffect } from "react";
import { fetchQuote, fetchStockDetails } from '../app/api/stock/stock-api';

const TrendingStocks = () => {
  const trendingStocks = ["AAPL", "MSFT", "TSLA", "AMZN"]; 
  const [trendingData, setTrendingData] = useState([]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const data = await Promise.all(
          trendingStocks.map(async (symbol) => {
            const details = await fetchStockDetails(symbol);
            const quote = await fetchQuote(symbol);
            return {
              symbol,
              details,
              quote,
            };
          })
        );
        setTrendingData(data);
      } catch (error) {
        console.error("Error fetching trending stocks:", error.message);
      }
    };

    fetchTrendingData();
  }, [trendingStocks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden bg-[#F5F7F8] rounded-md shadow-md">
      {trendingData.map(({ symbol, quote, details }) => (
        <div key={symbol} className="news-card">
          <div className="w-full h-full rounded-md relative p-6">
            <span className="absolute left-4 top-4 text-[#38bfc3] text-sm md:text-lg xl:text-xl 2xl:text-2xl">
             {symbol}
            </span>
            <div className="w-full h-full flex">
              <span className="mt-6 text-lg md:text-xl 2xl:text-2xl flex items-center">
                ${Math.abs(quote.c).toFixed(2)}
              </span>
              <span className={`ml-1 mt-5  text-xs md:text-sm 2xl:text-lg ${quote.d > 0 ? "text-lime-500" : "text-red-500"}`}>
                <span className="ml-1">
                  ({quote.dp > 0 ? '↑' : '↓'}{Math.abs(quote.dp).toFixed(2)}%)
                </span>
                {quote.d > 0 ? ` +${quote.d}` : ` ${quote.d}`}{" "}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingStocks;
