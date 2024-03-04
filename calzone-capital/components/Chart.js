import React, { useContext, useState, useEffect } from "react";
import Card from "./Card";
import ChartFilter from "./ChartFilter";
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
} from "recharts";
import StockContext from '/context/StockContext';
import { fetchTwelveData } from "../app/api/stock/stock-api";

const Chart = () => {
  const [selectedInterval, setSelectedInterval] = useState("1D");
  const [data, setData] = useState([]);
  const { stockSymbol } = useContext(StockContext);

  const intervals = ["1D", "1W", "1M", "1Y"];

  const handleIntervalChange = (newInterval) => {
    setSelectedInterval(newInterval);
  };

  const updateChartData = async () => {
    try {
      const result = await fetchTwelveData(stockSymbol, selectedInterval);
      
      // Check if the response has the expected structure
      if (result && result.values && Array.isArray(result.values)) {
        const formattedData = result.values.map((item) => ({
          value: parseFloat(item.close),
          date: new Date(item.datetime),
        }));
        const reversedData = formattedData.reverse();
  
        setData(reversedData);
      } else {
        console.error("Invalid data structure in API response:", result);
        setData([]);
      }
    } catch (error) {
      setData([]);
      console.error(error);
    }
  };

  useEffect(() => {
    updateChartData();
  }, [stockSymbol, selectedInterval]);

  return (
    <Card>
      <div className="interval-selector">
        {intervals.map((interval) => (
          <button
            key={interval}
            className={selectedInterval === interval ? "active" : ""}
            onClick={() => handleIntervalChange(interval)}
          >
            {interval}
          </button>
        ))}
      </div>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#38bfc3"
            fillOpacity={1}
            fill="url(#chartColor)"
            strokeWidth={0.5}
          />
          <XAxis
            dataKey="date"
            domain={['auto', 'auto']}
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);

              switch (selectedInterval) {
                case "1D":
                  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                case "1W":
                  return date.toLocaleDateString(undefined, { weekday: 'short' });
                case "1M":
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                case "1Y":
                  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
                default:
                  return '';
              }
            }}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => `${value.toFixed(2)}`} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default Chart;
