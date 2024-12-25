import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../config/url';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsSigningUp(true);
    try {
      await axios.post(`${baseUrl}/api/signup`, formData);
      toast.success('Sign up successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error('Sign up failed. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(251,246,233)] bg-opacity-90 pt-16">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-[rgb(17,139,80)]">Sign up for an account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block text-[rgb(93,185,150)]" htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(17,139,80)]"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-[rgb(93,185,150)]" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(17,139,80)]"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-[rgb(93,185,150)]" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(17,139,80)]"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-[rgb(93,185,150)]" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[rgb(17,139,80)]"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                disabled={isSigningUp}
                className={`px-6 py-2 mt-4 text-white rounded-lg ${
                  isSigningUp
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[rgb(17,139,80)] hover:bg-[rgb(93,185,150)]'
                }`}
              >
                {isSigningUp ? 'Signing Up...' : 'Sign Up'}
              </button>
              <Link to="/login" className="text-sm text-[rgb(17,139,80)] hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
