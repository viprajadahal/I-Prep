import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('iprep-token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await authService.getMe();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem('iprep-token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { access_token } = response.data;
    localStorage.setItem('iprep-token', access_token);

    const userResponse = await authService.getMe();
    setUser(userResponse.data);
    setIsAuthenticated(true);
    return true;
  };

  const register = async (data) => {
    const response = await authService.register({
      email: data.email,
      full_name: data.name,
      password: data.password,
      target_band: data.targetBand || 7.0,
      role: 'student',
    });

    const loginResponse = await authService.login({ email: data.email, password: data.password });
    const { access_token } = loginResponse.data;
    localStorage.setItem('iprep-token', access_token);

    setUser(response.data);
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
