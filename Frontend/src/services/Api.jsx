import axios from 'axios';


const API_URL = 'http://localhost:8000/api'; 
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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

  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;