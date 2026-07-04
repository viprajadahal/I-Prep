import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // backend's address

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const token = response.data.access_token;
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (data) => {
  await axios.post(`${API_URL}/auth/register`, {
    email: data.email,
    full_name: data.name,
    password: data.password,
    target_band: parseFloat(data.targetBand),
  });

  // registration doesn't log you in automatically, so do that next
  await login(data.email, data.password);
};

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};