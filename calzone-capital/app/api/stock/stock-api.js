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