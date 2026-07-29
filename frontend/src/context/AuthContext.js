import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('iprep-token');
    if (token) {
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('iprep-token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, null, {
      params: { email, password }
    });
    const token = response.data.access_token;
    localStorage.setItem('iprep-token', token);

    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(meResponse.data);
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
    await login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem('iprep-token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
