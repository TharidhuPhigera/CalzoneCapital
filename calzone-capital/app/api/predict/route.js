export const fetchPrediction = async (stockSymbol, timeframe) => {
  const response = await fetch(`http://127.0.0.1:5001/predict/new-model?symbol=${stockSymbol}&timeframe=${timeframe}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchStrategies = async (stockSymbol, timeframe, investmentAmount) => {
  const response = await fetch(`http://127.0.0.1:5001/strategies?symbol=${stockSymbol}&timeframe=${timeframe}&investment=${investmentAmount}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};