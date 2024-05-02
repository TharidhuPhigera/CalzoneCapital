import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PredictionChart = ({ data }) => {
  const formattedData = data?.dates.map((date, index) => ({
    datetime: new Date(date), 
    price: data.original_test_data[index],
    prediction: data.predictions[index],
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
      <LineChart data={formattedData}>
        <Tooltip 
          labelFormatter={labelFormatter} 
          formatter={valueFormatter}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#38bfc3"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="prediction"
          stroke="#ff7300"
          strokeWidth={2}
          dot={false}
        />
        <XAxis 
          dataKey="datetime" 
          tickFormatter={dateFormatter}
          minTickGap={20} 
        />
        <YAxis domain={['auto', 'auto']} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PredictionChart;
