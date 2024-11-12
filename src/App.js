import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import './App.css';

const hourlyData = { value: 7.1 }; // Current hourly value
const dataDaily = [
  { name: 'Mon', value: 6.8 },
  { name: 'Tue', value: 7.1 },
  { name: 'Wed', value: 6.5 },
  { name: 'Thu', value: 7.3 },
  { name: 'Fri', value: 7.0 },
];
const dataMonthly = [
  { name: 'Week 1', value: 6.9 },
  { name: 'Week 2', value: 7.2 },
  { name: 'Week 3', value: 6.7 },
  { name: 'Week 4', value: 7.0 },
];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <h1>Farm Dashboard</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <div className="content">
        <DataCard title="pH Level" data={{ daily: dataDaily, monthly: dataMonthly }} currentHourly={hourlyData.value} message="pH is stable" />
        <DataCard title="Temperature" data={{ daily: dataDaily, monthly: dataMonthly }} currentHourly={25} message="Temperature is within range" />
        <DataCard title="Humidity" data={{ daily: dataDaily, monthly: dataMonthly }} currentHourly={45} message="Humidity level is optimal" />
      </div>
    </div>
  );
};

const DataCard = ({ title, data, currentHourly, message }) => {
  const averageDaily = (data.daily.reduce((sum, d) => sum + d.value, 0) / data.daily.length).toFixed(2);
  const minDaily = Math.min(...data.daily.map(d => d.value)).toFixed(2);
  const maxDaily = Math.max(...data.daily.map(d => d.value)).toFixed(2);

  const averageMonthly = (data.monthly.reduce((sum, d) => sum + d.value, 0) / data.monthly.length).toFixed(2);
  const minMonthly = Math.min(...data.monthly.map(d => d.value)).toFixed(2);
  const maxMonthly = Math.max(...data.monthly.map(d => d.value)).toFixed(2);

  return (
    <div className="data-card">
      <h2>{title}</h2>

      <div className="hourly-section">
      <img src={`/assets/${title.toLowerCase()}.png`} alt={title} className="metric-image" />
        <div className="hourly-info">
          <p>Current Hourly: {currentHourly}</p>
          <p className="message">{message}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <p>Daily - Min: {minDaily}, Max: {maxDaily}, Avg: {averageDaily}</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.daily} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                {data.daily.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#82ca9d' : '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <p>Monthly - Min: {minMonthly}, Max: {maxMonthly}, Avg: {averageMonthly}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
