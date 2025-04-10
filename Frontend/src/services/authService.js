import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/authentication';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const authService = {
  
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/login/', credentials);
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error en el servidor' };
    }
  },

  
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error en el servidor' };
    }
  },

  
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axiosInstance.post('/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  initiateGoogleLogin: async () => {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_GOOGLE_OAUTH_CALLBACK_URL;
      
      // Construir la URL según el formato de django-allauth
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        `redirect_uri=${encodeURIComponent(redirectUri)}` + 
        `&prompt=consent` + 
        `&response_type=code` + 
        `&client_id=${encodeURIComponent(clientId)}` + 
        `&scope=${encodeURIComponent('profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events')}` + 
        `&access_type=offline`;
      
      // Redireccionar
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  },


  
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/authentication/refresh_token/',
        { refresh_token: refreshToken }
      );
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
};

export default authService;
