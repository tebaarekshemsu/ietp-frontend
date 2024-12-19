import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import io from 'socket.io-client';
import { baseUrl } from '../config/url';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [availableLayers, setAvailableLayers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setIsAuthenticated(true);
          setUser(decodedToken);
          initializeSocket(token);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
  }, []);

  const initializeSocket = (token) => {
    const newSocket = io(baseUrl, {
      auth: { token }
    });

    newSocket.on('notification', (newNotification) => {
      setNotifications((prev) => [
        ...prev,
        { ...newNotification, read: false }
      ]);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);
  };
  const login = async (email, password) => {
    const response = await axios.post(baseUrl+'/api/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUser(decoded);
    initializeSocket(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setAvailableLayers([]);
    setNotifications([]);
  };

  const markNotificationAsRead = (index) => {
    setNotifications((prev) =>
      prev.map((notification, i) =>
        i === index ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        availableLayers,
        setAvailableLayers,
        notifications,
        setNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

