import React from 'react'
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import RegisterForm from '../components/Sidebar/RegisterForm.jsx';
import LoginForm from '../components/Sidebar/LoginForm';
import AppointmentForm from '../components/Sidebar/AppointmentForm'
import PersonalDataForm from '../components/Sidebar/PersonalDataForm'
import { HomePage } from '../pages/MainContent.jsx';
import { useAuth } from '../context/AuthContext';
import '../App.css'
import GoogleCallback from '../components/Auth/GoogleCallback';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to={user ? "/app" : "/login"} replace />} />

      {/* Rutas protegidas */}
      <Route path="/app" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/crear-cita" element={
        <ProtectedRoute>
          <AppointmentForm />
        </ProtectedRoute>
      } />
      <Route path="/formulario-persona" element={
        <ProtectedRoute>
          <PersonalDataForm />
        </ProtectedRoute>
      } />
      <Route path="/consultar-citas" element={
        <ProtectedRoute>
          <div>Consulta de Citas</div>
        </ProtectedRoute>
      } />

      {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
