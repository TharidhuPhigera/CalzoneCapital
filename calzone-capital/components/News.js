import React, { useState, useEffect } from 'react';
import { getMarketNews } from "../app/api/stock/stock-api";


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
    <div>
        <h2 className="text-xl mt-2 mb-2">Market News</h2>
        <div className="bg-[#F5F7F8] rounded-md shadow-md p-4 mb-4 w-2/5">
            {news.map((article) => (
            <div key={article.id} className="flex mb-3">
                <img
                src={article.image}
                alt={article.headline}
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
