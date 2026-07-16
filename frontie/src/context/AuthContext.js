import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('iprep-token');
    if (!token) {
      setLoading(false);
      return;
    }
    authService.me()
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('iprep-token');
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { access_token } = response.data;
    localStorage.setItem('iprep-token', access_token);
    const meResponse = await authService.me();
    setUser(meResponse.data);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (data) => {
    await authService.register(data);
    const response = await authService.login(data.email, data.password);
    const { access_token } = response.data;
    localStorage.setItem('iprep-token', access_token);
    const meResponse = await authService.me();
    setUser(meResponse.data);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('iprep-token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};