import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // on app load, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // token expired or invalid
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });
    const { access_token, role, user: userData } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('role', role);

    setUser(userData);
    setIsAuthenticated(true);
    return { role };
  };

  const register = async (data) => {
    await axios.post(`${API_URL}/api/v1/auth/register`, {
      email: data.email,
      full_name: data.name,
      password: data.password,
      target_band: parseFloat(data.targetBand),
    });
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
  <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, login, register, logout, isAdmin }}>
    {children}
  </AuthContext.Provider>
);
};