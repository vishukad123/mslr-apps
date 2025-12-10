import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem("role");

     if (token && role) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ role: localStorage.getItem('role') }); // Simplify, decode if needed
    }
      setLoading(false);
  }, []);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
    {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);