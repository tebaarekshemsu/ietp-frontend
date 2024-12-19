import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
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

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const response = await axios.get(baseUrl+'/api/dashboard-detail/0', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setSoilData(response.data);
      } catch (error) {
        console.error('Error fetching soil data:', error);
      }
    };

    fetchSoilData();
  }, []);
  const renderBarChart = (sensorData) => {
    const data = {
      labels: sensorData.values.map(v => v.timestamp),
      datasets: [{
        label: sensorData.name,
        data: sensorData.values.map(v => v.value),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${sensorData.name} (${sensorData.unit})`,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  if (!soilData) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8" style={{backgroundImage: "url('https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=1024x1024&w=is&k=20&c=yCC31xDwz8uezGmsEWpCcA5QMW95C8f-COaKY4_eJig=')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Soil Data (Layer 0)</h1>
        {Object.entries(soilData).map(([area, devices]) => (
          <div key={area} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Area {area}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(devices.sensors).map(([sensorName, sensorData]) => (
                <div key={sensorName} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-xl font-medium mb-2 text-green-500">{sensorName}</h3>
                  {sensorData.values && sensorData.values.length > 0 ? (
                    renderBarChart(sensorData)
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Soil;

