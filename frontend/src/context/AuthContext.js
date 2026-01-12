import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && role) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ role, name });
    }
    setLoading(false);
  }, []);

  const login = (token, role, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (name) localStorage.setItem('name', name);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ role, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
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