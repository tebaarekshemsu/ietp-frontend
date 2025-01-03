import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Droplet, Activity, Power } from 'react-feather';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import io from 'socket.io-client';
import { baseUrl } from '../config/url';

const socket = io(baseUrl);  // Define the socket instance

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const { setAvailableLayers } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(baseUrl + '/api/dashboard', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setDashboardData(response.data);
        const availableLayers = Object.keys(response.data).filter(layer => layer !== '0');
        setAvailableLayers(availableLayers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [setAvailableLayers]);

  const getIcon = (name) => {
    if (name.toLowerCase().includes('temperature')) return <Thermometer className="w-6 h-6 text-[rgb(17,139,80)]" />;
    if (name.toLowerCase().includes('humidity') || name.toLowerCase().includes('moisture')) return <Droplet className="w-6 h-6 text-[rgb(93,185,150)]" />;
    if (name.toLowerCase().includes('ph')) return <Activity className="w-6 h-6 text-[rgb(227,240,175)]" />;
    return <Power className="w-6 h-6 text-[rgb(251,246,233)]" />;
  };

  useEffect(() => {
    if (socket) {
      console.log('Listening for real-time updates...');

      socket.on('dataUpdate', (data) => {
        console.log('Received real-time update:', data);

        try {
          const { name, value } = data;

          if (!name) {
            console.error('Received update with undefined name');
            return;
          }

          // Update dashboardData
          setDashboardData((prevData) => {
            const updatedData = { ...prevData };

            let found = false;

            Object.keys(updatedData).forEach((layer) => {
              Object.keys(updatedData[layer]).forEach((area) => {
                const sensorIndex = updatedData[layer][area].sensors.findIndex(
                  (sensor) => sensor.name === name
                );
                if (sensorIndex !== -1) {
                  updatedData[layer][area].sensors[sensorIndex].value = value;
                  found = true;
                }

                const motorIndex = updatedData[layer][area].motors.findIndex(
                  (motor) => motor.name === name
                );
                if (motorIndex !== -1) {
                  updatedData[layer][area].motors[motorIndex].value = value;
                  found = true;
                }
              });
            });

            if (!found) {
              console.warn(`Device with name ${name} not found in dashboardData`);
            }

            return updatedData;
          });
        } catch (err) {
          console.error('Error updating real-time data:', err);
        }
      });

      socket.on('error', (err) => {
        console.error('Socket error:', err.message);
      });
    }
  }, []); // Removed 'socket' from dependency array

  return (
    <div className="container mx-auto px-4 py-8 pt-16" style={{ backgroundImage: "url('https://media.istockphoto.com/id/1255871842/photo/smart-farming-with-iot-futuristic-agriculture-concept.jpg?s=1024x1024&w=is&k=20&c=Oj8GAw0fCDPFjxR-_vMZV7MA7EfG_8O-Qoe-dB45wLs=')", backgroundSize: 'fill', backgroundPosition: 'center' }}>
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Dashboard</h1>

        {Object.entries(dashboardData).map(([layer, areas]) => (
          <div key={layer} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              {layer === '0' ? 'Soil' : `Hydroponic Layer ${layer}`}
            </h2>
            {Object.entries(areas).map(([area, devices]) => (
              <div key={area} className="mb-6">
                <h3 className="text-xl font-medium mb-3 text-green-500">Area {area}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {devices.sensors.map((sensor) => (
                    <div key={sensor.name} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center mb-2">
                        {getIcon(sensor.name)}
                        <span className="ml-2 font-medium text-gray-700">{sensor.name}</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {sensor.value !== null ? `${sensor.value} ${sensor.unit}` : 'No data'}
                      </p>
                      <p className={`text-sm ${sensor.status === 'normal' ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {sensor.status}
                      </p>
                    </div>
                  ))}
                  {/* {devices.motors.map((motor) => (
                    <div key={motor.name} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center mb-2">
                        <Power className="w-6 h-6 text-yellow-500" />
                        <span className="ml-2 font-medium text-gray-700">{motor.name}</span>
                      </div>
                      <p className={`text-sm ${motor.status === 'on' ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {motor.status}
                      </p>
                    </div>
                  ))} */}
                </div>
              </div>
            ))}
          </div>
        ))}
        <Link to="/add-device" className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300">
          Add New Device
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;