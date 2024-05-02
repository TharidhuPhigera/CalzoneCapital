import React, { useContext, useEffect, useState, useRef } from 'react'
import Chart from './Chart'
import Header from './Header'
import PredictionChart from './PredictionChart';
import PredictionModal from './PredictionModal';
import StrategiesChart from './StrategiesChart';
import Overview from './Overview'
import CompanyNews from './CompanyNews'
import { fetchQuote, fetchStockDetails } from '../app/api/stock/stock-api'
import StockContext from '/context/StockContext'
import { fetchPrediction, fetchStrategies } from '../app/api/predict/route';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const Dashboard = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const [isTimeframePredictOpen, setIsTimeframePredictOpen] = useState(false);
  const [isTimeframeStrategyOpen, setIsTimeframeStrategyOpen] = useState(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);
  const [isStrategiesModalOpen, setIsStrategiesModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { stockSymbol } = useContext(StockContext);
  const [stockDetails, setStockDetails] = useState({});
  const [quote, setQuote] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');


  useEffect(() => {
    audioRef.current = new Audio('/audio/loading_music.mp3');
  },[]);

  const handleTimeframePredict = async (timeframe) => {
    setIsTimeframePredictOpen(false); 
    handlePredictClick(timeframe); 
  };

  const handleTimeframeStrategy = async (timeframe,  investmentAmount) => {
    setIsTimeframeStrategyOpen(false); 
    handleStrategyClick(timeframe, investmentAmount); 
  };

  const handlePredictClick = async (timeframe) => {
    setIsLoading(true); 
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Error playing audio:', e));
    }
    try {
      console.log("Fetching prediction for symbol:", stockSymbol, "with timeframe:", timeframe);
      const predictionData = await fetchPrediction(stockSymbol, timeframe);
      console.log("Prediction Data Received:", predictionData);
      setPrediction(predictionData);
      setIsPredictionModalOpen(true);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      console.log(error);
    } finally {
      setIsLoading(false); 
      if (audioRef.current) {
        audioRef.current.pause(); 
        audioRef.current.currentTime = 0; 
      }
    }
  };

  const handleStrategyClick = async (timeframe) => {
    setIsLoading(true); 
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Error playing audio:', e));
    }
    try {
      console.log("Fetching strategies for symbol:", stockSymbol, "with timeframe:", timeframe, "for:", investmentAmount);
      const strategyData = await fetchStrategies(stockSymbol, timeframe, investmentAmount);
      console.log("Strategy Data Received:", strategyData);
      setStrategy(strategyData);
      setIsStrategiesModalOpen(true);
    } catch (error) {
      console.error('Error fetching strategy:', error);
    } finally {
      setIsLoading(false); 
      if (audioRef.current) {
        audioRef.current.pause(); 
        audioRef.current.currentTime = 0; 
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 1 : 0; 
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
      {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-center items-center">
            <div className="text-white text-sm font-semibold mb-2">Loading...</div>
            <div className="spinner" aria-label="Loading predictions"></div>
            <style jsx>{`
              .spinner {
                border: 3px solid rgba(56, 191, 195, 0.3); /* Use RGBA with correct alpha value */
                border-top-color: #38bfc3; /* Directly set the border-top color without rgba */
                border-radius: 50%;
                width: 35px; /* Smaller spinner */
                height: 35px;
                animation: spin 2s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <button 
              onClick={toggleMute} 
              className="fixed top-5 right-5 z-50 p-2 bg-white rounded-full"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
      )}
        <div className="col-span-1 md:col-span-2 xl:col-span-3 row-span-1 flex justify-start items-center">
          <Header name={stockDetails.name} details={stockDetails} />
          <div className="flex items-center space-x-4">
            <button
            className='px-9 py-2 rounded-full bg-[#38bfc3] text-white hover:bg-transparent hover:text-[#38bfc3] border border-white hover:border-[#38bfc3] absolute top-32 right-56'
            onClick={() => setIsTimeframeStrategyOpen(true)}
            >
              Strategies
            </button>
            <PredictionModal isOpen={isTimeframeStrategyOpen} onClose={() => setIsTimeframeStrategyOpen(false)}>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold mb-4 text-center">Select Timeframe and Investment Amount</h2>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter total investment amount"
                  className="mb-4 p-2 border rounded"
                />
                <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-3">
                  {['3 months', '6 months', '1 year'].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => handleTimeframeStrategy(timeframe, investmentAmount)}
                      className='w-full py-2 rounded-lg bg-white text-[#38bfc3] hover:bg-[#38bfc3] hover:text-white transition duration-300 ease-in-out'
                    >
                      {timeframe.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </PredictionModal>
            <button 
              className='px-12 py-2 rounded-full bg-[#38bfc3] text-white hover:bg-transparent hover:text-[#38bfc3] border border-white hover:border-[#38bfc3] absolute top-32 right-12'
              onClick={() => setIsTimeframePredictOpen(true)}
            >
              Predict
            </button>
          </div>
          <PredictionModal isOpen={isTimeframePredictOpen} onClose={() => setIsTimeframePredictOpen(false)}>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4 text-center">Select Timeframe</h2>
              <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-3">
                {['1 week', '2 weeks', '1 month'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => handleTimeframePredict(timeframe)}
                    className='w-full py-2 rounded-lg bg-white text-[#38bfc3] hover:bg-[#38bfc3] hover:text-white transition duration-300 ease-in-out'
                  >
                    {timeframe.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </PredictionModal>
        </div>
      <PredictionModal
        isOpen={isPredictionModalOpen} 
        onClose={() => setIsPredictionModalOpen(false)}
        style={{ padding: '20px', width: '90%', maxWidth: '1200px' }}
      >
        <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/4 mr-4">
            <PredictionChart data={prediction} />
          </div>
          <div className="md:w-1/4 mt-4 md:mt-0 ml-4">
            <p><strong>Current Price:</strong> ${prediction?.evaluation.latest_historical_price.toFixed(2)}</p>
            <p><strong>Predicted Price:</strong> ${prediction?.evaluation.latest_predicted_price.toFixed(2)}</p>
            <p><strong>Change:</strong>
              <span className={`ml-2 ${prediction?.evaluation.change_in_percent > 0 ? "text-green-600" : "text-red-600"}`}>
                {prediction?.evaluation.change_in_percent.toFixed(2)}%
              </span>
            </p>
            <p><strong>Recommendation:</strong> {prediction?.evaluation.recommendation}</p>
          </div>
        </div>
      </PredictionModal>
      <PredictionModal
        isOpen={isStrategiesModalOpen} 
        onClose={() => setIsStrategiesModalOpen(false)}
        style={{ padding: '20px', width: '90%', maxWidth: '1200px' }}
      >
        <h2 className="text-xl font-bold mb-4">Strategies Results</h2>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/4 mr-4">
            <StrategiesChart data={strategy} />
          </div>
          <div className="md:w-1/4 mt-4 md:mt-0 ml-4">
            <h2 className='font-bold'>Stock Predictions</h2>
            <div className='mb-3'>
              <p>Current Price: ${strategy?.evaluation.latest_historical_price.toFixed(2)}</p>
              <p>Predicted Price: ${strategy?.evaluation.latest_predicted_price.toFixed(2)}</p>
              <p>Change:
                <span className={`ml-2 ${strategy?.evaluation.change_in_percent > 0 ? "text-green-600" : "text-red-600"}`}>
                  {strategy?.evaluation.change_in_percent.toFixed(2)}%
                </span>
              </p>
            </div>
            <h2 className='font-bold'>Weekly Investment</h2>
            <div className='mb-3'>
              <p>Invested: ${strategy?.evaluation.weekly_total_investment.toFixed(2)}</p>
              <p>Return: ${strategy?.evaluation.latest_weekly_value.toFixed(2)}</p>
              <p>Change:
                <span className={`ml-2 ${strategy?.evaluation.weekly_investment_change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {strategy?.evaluation.weekly_investment_change.toFixed(2)}%
                </span>
              </p>
            </div>
            <h2 className='font-bold'>Monthly Investment</h2>
            <div className='mb-3'>
              <p>Invested: ${strategy?.evaluation.monthly_total_investment.toFixed(2)}</p>
              <p>Return: ${strategy?.evaluation.latest_monthly_value.toFixed(2)}</p>
              <p>Change:
                <span className={`ml-2 ${strategy?.evaluation.monthly_investment_change > 0 ? "text-green-600" : "text-red-600"}`}>
                  {strategy?.evaluation.monthly_investment_change.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </PredictionModal>
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