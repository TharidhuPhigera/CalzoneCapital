import React, { useState, useEffect } from 'react';
import { getMarketNews } from "../app/api/stock/stock-api";
import { FaNewspaper } from 'react-icons/fa';


const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getMarketNews('general');
        setNews(data);
      } catch (error) {
        console.error('Error fetching market news:', error.message);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full">
        <h2 className="text-2xl mt-2 mb-5 pt-2">Market News</h2>
        <div className="bg-[#F5F7F8] rounded-md shadow-md p-4 mb-4 w-4/5">
            {news.map((article) => (
            <div key={article.id} className="flex mb-3">
                <img
                    src={article.image || '/images/news.png'}
                    alt={article.image ? article.headline : "News Icon"}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                <h3 className="text-xs mb-1">{article.headline}</h3>
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38bfc3] hover:underline text-xs"
                >
                    Read more
                </a>
                </div>
            </div>
            ))}
        </div>
    </div>
  );
};

export default News;
