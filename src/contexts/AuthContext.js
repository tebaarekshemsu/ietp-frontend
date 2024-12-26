import React, { createContext, useState, useEffect, useCallback } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import io from "socket.io-client";
import { baseUrl } from "../config/url";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [availableLayers, setAvailableLayers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(0);

  const initializeSocket = useCallback((token) => {
    const newSocket = io(baseUrl, {
      auth: { token },
    });

    newSocket.on("notification", (newNotification) => {
      setReadNotifications((prevCount) => prevCount + 1);
      setNotifications((prev) => [
        ...prev,
        { ...newNotification, read: false },
      ]);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }, []);

  const initializeLayers = async (userId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/layers/${userId}`);
      setAvailableLayers(response.data.layers || []); // Assuming the response contains `layers`
    } catch (error) {
      console.error("Error fetching layers:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setIsAuthenticated(true);
          setUser(decodedToken);
          initializeSocket(token);
          initializeLayers(decodedToken.id); // Pass user ID to fetch layers
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
    setIsLoading(false); // Set loading to false after initialization
  }, [initializeSocket]);

  const login = async (email, password) => {
    const response = await axios.post(`${baseUrl}/api/login`, {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setIsAuthenticated(true);
    setUser(decoded);
    initializeSocket(token);
    initializeLayers(decoded.id); // Fetch layers after login
  };

  const logout = () => {
    localStorage.removeItem("token");
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
        isLoading,
        user,
        login,
        logout,
        availableLayers,
        setAvailableLayers,
        notifications,
        setNotifications,
        readNotifications,
        setReadNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
