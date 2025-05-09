import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser && !authService.isAuthenticated()) {
          const refreshed = await authService.refreshToken();
          if (!refreshed) {
            
            setUser(null);
            authService.logout();
          } else {
            setUser(currentUser);
          }
        } else {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Error al inicializar la autenticación');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const setUsers = (user) => {
    setUser(user);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated,
    setUsers,

  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};