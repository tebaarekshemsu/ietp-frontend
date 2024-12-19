import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import SignUp from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Soil from './components/Soil';
import Hydroponic from './components/Hydroponic';
import AddDevice from './components/AddDevice';
import { AuthContext } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, availableLayers } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 ">
        <Header />
        <main className="container mx-auto">
          <Routes>
            <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/soil" element={isAuthenticated ? <Soil /> : <Navigate to="/login" replace />} />
            {availableLayers.map((layer) => (
              <Route 
                key={layer}
                path={`/hydroponic/${layer}`} 
                element={isAuthenticated ? <Hydroponic layer={layer} /> : <Navigate to="/login" replace />} 
              />
            ))}
            <Route path="/add-device" element={isAuthenticated ? <AddDevice /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;

