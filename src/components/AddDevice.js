import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, MenuItem } from '@material-ui/core';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../config/url';

const AddDevice = () => {
  const [formData, setFormData] = useState({
    name: '',
    layer: '',
    unit: '',
    type: '',
    area: '',
    critical_high: '',
    critical_low: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl+'/api/device', formData, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      toast.success('Device added successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to add device. Please try again.');
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Add New Device</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Device Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Device Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="layer">
              Layer
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="layer"
              type="number"
              placeholder="Layer"
              name="layer"
              value={formData.layer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unit">
              Unit
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="unit"
              type="text"
              placeholder="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Device Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select device type</option>
              <option value="sensor">Sensor</option>
              <option value="motor">Motor</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="area">
              Area
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="area"
              type="number"
              placeholder="Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
          {formData.type === 'sensor' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="critical_high">
                  Critical High
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="critical_high"
                  type="number"
                  placeholder="Critical High"
                  name="critical_high"
                  value={formData.critical_high}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="critical_low">
                  Critical Low
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="critical_low"
                  type="number"
                  placeholder="Critical Low"
                  name="critical_low"
                  value={formData.critical_low}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDevice;

