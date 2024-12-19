import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { baseUrl } from '../config/url';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(baseUrl); // Match the backend server

    socket.on('connect', () => {
      console.log(`Connected to server with ID: ${socket.id}`);
    });

    // Listen for incoming notifications
    socket.on('notification', (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    // Cleanup on unmount
    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ notifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
