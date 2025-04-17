import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const API_URL = 'http://localhost:8000/api';

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

const reservationService = {
  // Obtener todas las reservaciones del usuario actual
  getUserReservations: async () => {
    const {user} = useAuth();
    try {
      const response = await axiosInstance.get('/citas/my-reservationsr/',{user : user});
      return response.data;
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  },
  
  
  // Crear una nueva reservación
  createReservation: async (reservationData) => {
    try {
      const response = await axiosInstance.post('/citas/', reservationData);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  // Actualizar una reservación existente
  updateReservation: async (id, reservationData) => {
    try {
      const response = await axiosInstance.patch(`/citas/${id}/`, reservationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Cancelar/eliminar una reservación
  cancelReservation: async (id) => {
    try {
      const response = await axiosInstance.delete(`/citas/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling reservation with ID ${id}:`, error);
      throw error;
    }
  },
  
  
  // Obtener todos los profesionales
  getProfessionals: async () => {
    try {
      const response = await axiosInstance.get('/profesionales/');
      return response.data;
    } catch (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }
  },

  getNotifications: async () => {
    const {user} = useAuth();
    try {
      const response = await axiosInstance.get('/notificaciones/',{user : user});
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
};

export default reservationService;