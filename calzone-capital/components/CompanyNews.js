import React, { useState, useEffect, useContext } from 'react';
import { fetchCompanyNews } from "../app/api/stock/stock-api";
import StockContext from '/context/StockContext'
import Card from './Card';


const CompanyNews = ({ symbol }) => {
    const [news, setCompanyNews] = useState([]);
    const { stockSymbol } = useContext(StockContext);
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          const data = await fetchCompanyNews(stockSymbol);
          setCompanyNews(data);
          console.log('Fetched news for symbol:', stockSymbol);
        } catch (error) {
          console.error('Error fetching market news:', error.message);
        }
      };
  
      fetchNews();
    }, [stockSymbol]);
  
  return (
    <div>
        <Card>
        <h2 className="text-xl mb-3">Latest News</h2>
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
                    className="text-[#38bfc3] hover:underline text-xs text-right"
                >
                    Read more
                </a>
                </div>
            </div>
            ))}
        </Card>
    </div>
  );
};

export default CompanyNews;
