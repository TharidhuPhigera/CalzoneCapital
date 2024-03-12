export const fetchPrediction = async (stockSymbol) => {
    const response = await fetch(`http://127.0.0.1:5001/predict/short-term?symbol=${stockSymbol}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  };
