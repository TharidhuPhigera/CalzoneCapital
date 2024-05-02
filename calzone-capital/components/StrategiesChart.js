import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StrategiesChart = ({ data }) => {
  const formattedData = data?.dates.map((date, index) => ({
    date: new Date(date),
    predicted: data.future_predictions[index],
    weekly: data.weekly_investment_predictions[index],
    monthly: data.monthly_investment_predictions[index],
  }));

  const dateFormatter = (date) => {
    return date.getFullYear().toString();
  };

  const labelFormatter = (value) => {
    const date = new Date(value);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const valueFormatter = (value, name) => {
    if (typeof value === 'number') {
      const label = name === 'price' ? 'price' : name;
      return [`${value.toFixed(2)}`, label];
    }
    return [value, name];
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={dateFormatter}
          minTickGap={20} 
        />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip 
        labelFormatter={labelFormatter}
        formatter={valueFormatter} 
        />
        <Legend />
        <Line type="monotone" dataKey="predicted" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="weekly" stroke="#82ca9d" />
        <Line type="monotone" dataKey="monthly" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StrategiesChart;
