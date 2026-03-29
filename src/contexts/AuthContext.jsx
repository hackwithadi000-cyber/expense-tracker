import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token) {
      // Verify token and set user
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For now, we'll assume the token is valid
      // In a real app, you'd verify with the backend
      setUser({ email: 'user@example.com', role: 'user' }); // Mock user
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { access_token, refresh_token } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Decode user info from token or fetch user data
      setUser({ email, role: 'user' }); // Mock user data

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/api/auth/register', userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;