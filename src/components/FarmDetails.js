import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FarmDetails = ({ farmType, data }) => {
  const dailyData = data?.daily || [];
  const monthlyData = data?.monthly || [];

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
      <h2>{farmType} Farm Details</h2>
      <p>Daily Averages: Temperature - {data?.dailyAverage.temperature}°C, Humidity - {data?.dailyAverage.humidity}%, pH - {data?.dailyAverage.ph}</p>
      <p>Monthly Averages: Temperature - {data?.monthlyAverage.temperature}°C, Humidity - {data?.monthlyAverage.humidity}%, pH - {data?.monthlyAverage.ph}</p>

      <h3>Daily Data</h3>
      <LineChart width={600} height={300} data={dailyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
        <Line type="monotone" dataKey="humidity" stroke="#387908" />
        <Line type="monotone" dataKey="ph" stroke="#8884d8" />
      </LineChart>

      <h3>Monthly Data</h3>
      <LineChart width={600} height={300} data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
        <Line type="monotone" dataKey="humidity" stroke="#387908" />
        <Line type="monotone" dataKey="ph" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default FarmDetails;
