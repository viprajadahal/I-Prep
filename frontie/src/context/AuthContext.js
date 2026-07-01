import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    setUser({
      id: 1,
      name: 'Alex Johnson',
      email,
      avatar: null,
      targetBand: 7.5,
      currentBand: 6.5,
      country: 'India',
      isPremium: false,
    });
    setIsAuthenticated(true);
    return true;
  };

  const register = (data) => {
    setUser({
      id: 1,
      name: data.name,
      email: data.email,
      avatar: null,
      targetBand: data.targetBand,
      currentBand: 0,
      country: data.country,
      isPremium: false,
    });
    setIsAuthenticated(true);
    return true;
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