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
import { convertUnixTimestampToDate, createDate } from "../helpers/date-helper";
import { chartConfig } from "../constants/config";
import StockContext from '/context/StockContext';
import { fetchTwelveData } from "../app/api/stock/stock-api";

const Chart = () => {
  const [filter, setFilter] = useState("1D");
  const [data, setData] = useState([]);
  const { stockSymbol } = useContext(StockContext);

  useEffect(() => {
    const getDateRange = () => {
      const { days, weeks, months, years } = chartConfig[filter];
      const endDate = new Date();
      const startDate = createDate(endDate, -days, -weeks, -months, -years);

      return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    };

    const formatData = (response) => {
      const values = response.values || [];
      return values.map((item) => ({
        value: parseFloat(item.close),
        date: new Date(item.datetime),
      }));
    };
    

    const updateChartData = async () => {
      try {
        const { startDate, endDate } = getDateRange();
        const result = await fetchTwelveData(stockSymbol, startDate, endDate);
        console.log("API Response:", result);
        const formattedData = formatData(result);
        const reversedData = formattedData.reverse();
    
        setData(reversedData);
      } catch (error) {
        setData([]);
        console.error(error);
      }
    };
    
    updateChartData();
  }, [stockSymbol, filter]);

  const customTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(dataPoint.date);

      return (
        <div className="custom-tooltip">
          <p>{formattedDate} GMT+00</p>
          <p>{`$${dataPoint.value.toFixed(2)}`}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <Card>
      {/* <ul className="flex absolute top-2 right-2 z-40">
        {Object.keys(chartConfig).map((item) => (
          <li key={item}>
            <ChartFilter
              text={item}
              active={filter === item}
              onClick={() => {
                setFilter(item);
              }}
            />
          </li>
        ))}
      </ul> */}
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bfc3" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#38bfc3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip content={customTooltipContent} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#38bfc3"
            fill="url(#chartColor)"
            fillOpacity={1}
            strokeWidth={0.5}
          />
          <XAxis
            dataKey="date"
            domain={['auto', 'auto']}  
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
              return date.getHours() % 2 === 0 ? formattedTime : '';
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

export default Chart
