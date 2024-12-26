import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { baseUrl } from '../config/url';
import io from 'socket.io-client';

const socket = io(baseUrl);  // Define the socket instance
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Soil = () => {
  const [soilData, setSoilData] = useState(null);

const fetchSoilData = useCallback(async () => {
  try {
    const response = await axios.get(baseUrl + '/api/dashboard-detail/0', {
      headers: { Authorization: localStorage.getItem('token') },
    });
    setSoilData(response.data);
  } catch (error) {
    console.error('Error fetching soil data:', error);
  }
}, []);

useEffect(() => {
  fetchSoilData();
});

useEffect(() => {
    if (socket) {
      console.log('Listening for real-time updates...');
    
      socket.on('dataUpdate', (data) => {
        console.log('Received real-time update:', data);
        fetchSoilData();  // Refetch data on update
      });
    
      socket.on('error', (err) => {
        console.error('Socket error:', err.message);
      });
    }
  }, [fetchSoilData]);
  
  const calculateAverage = (values) => {
    if (!values || values.length === 0) return 0;
    const total = values.reduce((sum, entry) => sum + entry.value, 0);
    return total / values.length;
  };

  const calculateMinMax = (values) => {
    if (!values || values.length === 0) return { min: 0, max: 0 };
    const allValues = values.map((entry) => entry.value);
    return { min: Math.min(...allValues), max: Math.max(...allValues) };
  };

  const renderBarChart = (sensorData) => {
    const data = {
      labels: sensorData.values.map((v) =>
        new Date(v.timestamp).toLocaleString()
      ),
      datasets: [
        {
          label: `${sensorData.name}`,
          data: sensorData.values.map((v) => v.value),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${sensorData.name} (${sensorData.unit})`,
        },
      },
      scales: {
        x: { title: { display: true, text: 'Timestamp' } },
        y: { title: { display: true, text: `Value (${sensorData.unit || ''})` } },
      },
    };

    return (
      <div
        className="chart-container"
        style={{ height: '400px', maxHeight: '400px' }}
      >
        <Bar data={data} options={options} />
      </div>
    );
  };

  if (!soilData) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div
      className="container mx-auto px-4 py-8 pt-16"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=1024x1024&w=is&k=20&c=yCC31xDwz8uezGmsEWpCcA5QMW95C8f-COaKY4_eJig=')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Soil Data (Layer 0)</h1>
        {Object.entries(soilData).map(([area, devices]) => (
          <div key={area} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Area {area}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(devices.sensors)
                .filter(([, sensorData]) => sensorData.values && sensorData.values.length > 0)
                .map(([sensorName, sensorData]) => {
                  const average = calculateAverage(sensorData.values);
                  const { min, max } = calculateMinMax(sensorData.values);

                  return (
                    <div
                      key={sensorName}
                      className="bg-white rounded-lg shadow-md p-4 flex flex-col lg:flex-row gap-6"
                    >
                      <div className="w-full lg:w-2/3">{renderBarChart({ ...sensorData, name: sensorName })}</div>
                      <div className="w-full lg:w-1/3 flex flex-col justify-center">
                        <h3 className="text-xl font-medium mb-4 text-green-500">
                          {sensorName} Analytics
                        </h3>
                        <p className="text-gray-700">
                          <strong>Current Value:</strong> {sensorData.values[sensorData.values.length - 1]?.value}{' '}
                          {sensorData.unit}
                        </p>
                        <p className="text-gray-700">
                          <strong>Average:</strong> {average.toFixed(2)} {sensorData.unit}
                        </p>
                        <p className="text-gray-700">
                          <strong>Minimum:</strong> {min} {sensorData.unit}
                        </p>
                        <p className="text-gray-700">
                          <strong>Maximum:</strong> {max} {sensorData.unit}
                        </p>
                        <p className="text-gray-700">
                          <strong>Total Readings:</strong> {sensorData.values.length}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Soil;
