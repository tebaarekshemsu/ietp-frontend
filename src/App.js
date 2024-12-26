import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Soil from "./components/Soil";
import Hydroponic from "./components/Hydroponic";
import AddDevice from "./components/AddDevice";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated, isLoading, availableLayers } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator during initialization
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto">
          <Routes>
            <Route
              path="/signup"
              element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/soil"
              element={isAuthenticated ? <Soil /> : <Navigate to="/login" replace />}
            />
            {isAuthenticated && availableLayers.length > 0 &&
              availableLayers.map((layer) => (
                <Route
                  key={layer}
                  path={`/hydroponic/${layer}`}
                  element={<Hydroponic layer={layer} />}
                />
              ))}
            <Route
              path="/add-device"
              element={isAuthenticated ? <AddDevice /> : <Navigate to="/login" replace />}
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
            />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
