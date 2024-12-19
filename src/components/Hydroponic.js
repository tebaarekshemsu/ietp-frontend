import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { baseUrl } from '../config/url';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Hydroponic = ({ layer }) => {
  const [hydroponicData, setHydroponicData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHydroponicData = async () => {
      try {
        const response = await axios.get(baseUrl+`/api/dashboard-detail/${layer}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        if (Object.keys(response.data).length === 0) {
          // No data available for this layer
          navigate('/');
        } else {
          setHydroponicData(response.data);
        }
      } catch (error) {
        console.error('Error fetching hydroponic data:', error);
        navigate('/');
      }
    };

    fetchHydroponicData();
  }, [layer, navigate]);

  const renderLineChart = (sensorData) => {
    const data = {
      labels: sensorData.values.map(v => v.timestamp),
      datasets: [{
        label: sensorData.name,
        data: sensorData.values.map(v => v.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
          text: `${sensorData.name} Over Time`,
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  const renderBarChart = (sensorData) => {
    const data = {
      labels: sensorData.values.map(v => v.timestamp),
      datasets: [{
        label: sensorData.name,
        data: sensorData.values.map(v => v.value),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
          text: `${sensorData.name} Comparison`,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  const renderPieChart = (sensorData) => {
    const data = {
      labels: ['Below Average', 'Average', 'Above Average'],
      datasets: [{
        data: [
          sensorData.values.filter(v => v.value < sensorData.average).length,
          sensorData.values.filter(v => v.value === sensorData.average).length,
          sensorData.values.filter(v => v.value > sensorData.average).length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
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
          text: `${sensorData.name} Distribution`,
        },
      },
    };

    return <Pie data={data} options={options} />;
  };

  if (!hydroponicData) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-16" style={{backgroundImage: "url('https://media.istockphoto.com/id/1152373318/photo/vertical-farming-offers-a-path-toward-a-sustainable-future.jpg?s=1024x1024&w=is&k=20&c=_iF7cl1kUmh5-Fpk8BGbps4fBwblfFgLiZ_zhLJ6ISE=')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Hydroponic Data (Layer {layer})</h1>
        {Object.entries(hydroponicData).map(([area, devices]) => (
          <div key={area} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">Area {area}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.sensors && Object.entries(devices.sensors).map(([sensorName, sensorData]) => (
                <div key={sensorName} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-xl font-medium mb-2 text-green-500">{sensorName}</h3>
                  {sensorData.values && sensorData.values.length > 0 ? (
                    <>
                      <div className="mb-4">{renderLineChart(sensorData)}</div>
                      <div className="mb-4">{renderBarChart(sensorData)}</div>
                      <div className="mb-4">{renderPieChart(sensorData)}</div>
                      <div className="mt-4">
                        <p className="text-gray-700">Current Value: {sensorData.values[sensorData.values.length - 1].value} {sensorData.unit}</p>
                        <p className="text-gray-700">Average: {sensorData.average?.toFixed(2)} {sensorData.unit}</p>
                      </div>
                    </>
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

export default Hydroponic;

