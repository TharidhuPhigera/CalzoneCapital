import React, { useContext, useState, useEffect, useRef } from "react";
import Card from "./Card";
import { Area, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart } from "recharts";
import StockContext from '/context/StockContext';
import { fetchTwelveData } from "../app/api/stock/stock-api";

const Chart = () => {
  const [selectedInterval, setSelectedInterval] = useState("1W"); 
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); 
  const { stockSymbol } = useContext(StockContext);
  const intervals = ["1D", "1W", "1M", "6M", "1Y", "ALL"];

  const isWeekend = (date) => {
    return date.getDay() === 0 || date.getDay() === 6; // 0 is Sunday, 6 is Saturday
  };

  // Check if today is a weekend
  const todayIsWeekend = isWeekend(new Date());


  const handleIntervalChange = (newInterval) => {
    setSelectedInterval(newInterval);
  };

  const updateChartData = async () => {
    let apiInterval;
  
    switch (selectedInterval) {
      case "1D":
        apiInterval = "1min";
        break;
      case "1W":
        apiInterval = "30min";
        break;
      default:
        apiInterval = "1day"; 
    }
  
    try {
      const result = await fetchTwelveData(stockSymbol, apiInterval, 5000);
      if (result && result.values && Array.isArray(result.values)) {
        const formattedData = result.values.map(item => ({
          value: parseFloat(item.close),
          date: new Date(item.datetime).getTime(),
        }));
        const reversedData = formattedData.reverse();
        setAllData(reversedData);
        setData(reversedData);
      } else {
        console.error("Invalid data structure in API response:", result);
        setData([]);
        setAllData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
      setAllData([]);
    }
  };
  

  const filterDataForInterval = (allData, interval) => {
    const now = new Date();
    let filteredData = allData;
  
    switch (interval) {
      case "1D":
        filteredData = allData.filter(data => now - new Date(data.date) <= 24*60*60*1000);
        break;
      case "1W":
        const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000;
        filteredData = allData.filter(data => now - new Date(data.date) <= fiveDaysInMilliseconds);
        break;
      case "1M":
        now.setMonth(now.getMonth() - 1);
        filteredData = allData.filter(data => new Date(data.date) >= now);
        break;
        case "6M":
          now.setMonth(now.getMonth() - 6);
          filteredData = allData.filter(data => new Date(data.date) >= now);
          break;
      case "1Y":
        now.setFullYear(now.getFullYear() - 1);
        filteredData = allData.filter(data => new Date(data.date) >= now);
        break;
    }
  
    setData(filteredData);
  };
  
  const lastDateRef = useRef('');
  const everyNthDay = 3;

  const dateFormatter = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const dayOfMonth = date.getDate();

    switch (selectedInterval) {
      case "1D":
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case "1W":
        if (formattedDate !== lastDateRef.current) {
          lastDateRef.current = formattedDate; 
          return formattedDate;
        }
        return '';
      case "1M":
        if (dayOfMonth % everyNthDay === 0) {
          return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        return '';
      case "1Y":
        return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      default:
        return '';
    }
  };

  useEffect(() => {
    updateChartData('1year');
  }, [stockSymbol]);

  useEffect(() => {
    filterDataForInterval(allData, selectedInterval);
  }, [selectedInterval, allData]);

  useEffect(() => {
    filterDataForInterval(allData, selectedInterval);
    lastDateRef.current = '';
  }, [selectedInterval, allData]);

  return (
    <Card>
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 10,
          }}>
            {intervals.map(interval => (
              <button
                key={interval}
                onClick={() => handleIntervalChange(interval)}
                style={{
                  cursor: 'pointer',
                  margin: '10px',
                  color: 'black',
                }}
              >
                {interval}
              </button>
            ))}
        </div>
        {todayIsWeekend && selectedInterval === "1D" ? (
        <div className="flex items-center justify-center h-full">
          <p>The stock market is closed on weekends. Please select another timeframe.</p>
        </div>
      ) : (
        <ResponsiveContainer>
          <AreaChart data={data}>
              <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bfc3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#38bfc3" stopOpacity={0}/>
                </linearGradient>
              </defs>
            <Tooltip labelFormatter={(label) => dateFormatter(label)} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#38bfc3"
              fillOpacity={1}
              fill="url(#chartColor)"
              strokeWidth={0.5}
            />
            <XAxis dataKey="date" tickFormatter={dateFormatter} />
            <YAxis domain={['auto', 'auto']} tickFormatter={value => `${value.toFixed(2)}`} />
          </AreaChart>
        </ResponsiveContainer>
        )}
    </Card>
  );
}

export default Chart;
