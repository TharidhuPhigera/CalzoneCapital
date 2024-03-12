import React, { useContext, useEffect, useState } from 'react'
import Chart from './Chart'
import Header from './Header'
import Details from './Details'
import Overview from './Overview'
import CompanyNews from './CompanyNews'
import { fetchQuote, fetchStockDetails } from '../app/api/stock/stock-api'
import StockContext from '/context/StockContext'
import { fetchPrediction } from '../app/api/predict/route';

const Dashboard = () => {

  const [isLoading, setIsLoading] = useState(false);

  const { stockSymbol } = useContext(StockContext);

  const [stockDetails, setStockDetails] = useState({});

  const [quote, setQuote] = useState({});

  const [prediction, setPrediction] = useState(null);

  const handlePredictClick = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching prediction for symbol:", stockSymbol);
      const predictionData = await fetchPrediction(stockSymbol);
      setPrediction(predictionData);
      console.log(predictionData);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateStockDetails = async () => {
      try {
        const result = await fetchStockDetails(stockSymbol);
        setStockDetails(result);
      } catch (error) {
        setStockDetails({});
        console.log(error);
      }
    };

    const updateStockOverview = async () => {
      try {
        const result = await fetchQuote(stockSymbol);
        setQuote(result);
      } catch (error) {
        setQuote({});
        console.log(error);
      }
    };

    updateStockDetails();
    updateStockOverview();
  }, [stockSymbol]);


  return (
    <div className='h-screen w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-9 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10'>
      <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center">
        <Header name={stockDetails.name} details={stockDetails} />
        <button className='px-6 py-3 rounded-full sm:inline-block mr-6 bg-[#38bfc3] text-black hover:bg-transparent hover:text-[#38bfc3] border border-black hover:border-[#38bfc3]' onClick={handlePredictClick}>Predict</button>
      </div>
        <div className="md:col-span-2 row-span-4">
            <Chart/>
        </div>
        <div>
            <Overview 
            symbol={stockSymbol}
            price={quote.c}
            change={quote.d}
            changePercent={quote.dp}
            currency={stockDetails.currency}
            closePrice={quote.pc}
            />
        </div>
        <div className="row-span-2 xl:row-span-3">
            <CompanyNews symbol={stockDetails.symbol}/>
        </div>
    </div>
  )
}

export default Dashboard