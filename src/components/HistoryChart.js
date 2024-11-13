import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HistoryChart = ({ title, data }) => {
  return (
    <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>{title}</h2>
      <LineChart width={300} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="traditional" stroke="#8884d8" />
        <Line type="monotone" dataKey="hydroponic" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};

export default HistoryChart;
