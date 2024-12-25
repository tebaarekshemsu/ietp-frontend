import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(251,246,233)] bg-opacity-90 pt-16">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-[rgb(17,139,80)]">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
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
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-[rgb(17,139,80)] rounded-lg hover:bg-[rgb(93,185,150)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <Link to="/signup" className="text-sm text-[rgb(17,139,80)] hover:underline">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
