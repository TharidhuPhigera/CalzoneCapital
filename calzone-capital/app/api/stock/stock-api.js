const basePath = "https://finnhub.io/api/v1";
const twelveDataBasePath = "https://api.twelvedata.com";

export const searchSymbol = async (query) => {
  const url = `${basePath}/search?q=${query}&token=cm4748hr01qu6hdae6hgcm4748hr01qu6hdae6i0`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};


export const fetchStockDetails = async (stockSymbol) => {
  const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=cm4748hr01qu6hdae6hgcm4748hr01qu6hdae6i0`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const fetchQuote = async (stockSymbol) => {
  const url = `${basePath}/quote?symbol=${stockSymbol}&token=cm4748hr01qu6hdae6hgcm4748hr01qu6hdae6i0`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const fetchTwelveData = async (stockSymbol) => {
  const url = `${twelveDataBasePath}/time_series?symbol=${stockSymbol}&interval=30min&apikey=7b5861f61d974edeb58bd9da0cc76789`;
  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
};

export const getMarketNews = async (category = 'general', limit = 5) => {
  const url = `${basePath}/news?category=${category}&token=cm4748hr01qu6hdae6hgcm4748hr01qu6hdae6i0`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const limitedData = data.slice(0, limit);
    return limitedData;
  } catch (error) {
    throw new Error(`Error fetching market news: ${error.message}`);
  }
};

export const fetchCompanyNews = async (stockSymbol, limit = 4) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const fromDate = new Date(currentDate);
    fromDate.setDate(currentDate.getDate() - 7);
    const formattedFromDate = fromDate.toISOString().split('T')[0];
    const url = `${basePath}/company-news?symbol=${stockSymbol}&from=${formattedFromDate}&to=${formattedDate}&token=cm4748hr01qu6hdae6hgcm4748hr01qu6hdae6i0`;
    const response = await fetch(url);

    if (!response.ok) {
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const limitedData = data.slice(0, limit);
    
    return limitedData;
  } catch (error) {
    throw new Error(`Error fetching company news: ${error.message}`);
  }
};
