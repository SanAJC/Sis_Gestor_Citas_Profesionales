import React from 'react'
import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import RegisterForm from '../components/Sidebar/RegisterForm.jsx';
import LoginForm from '../components/Sidebar/LoginForm';
import AppointmentForm from '../components/Sidebar/AppointmentForm'
import PersonalDataForm from '../components/Sidebar/PersonalDataForm'
import { HomePage } from '../pages/MainContent.jsx';
import '../App.css'


export  const AppRouter = () => {

    // Estado simple para manejar la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Función simple para cerrar sesión (puedes añadirla a tu Sidebar o donde necesites)
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };
  return (
    <Routes>
        {/* Rutas públicas */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to={isLoggedIn ? "/app" : "/login"} replace />} />

        <Route path="/app" element={<HomePage />} />
        <Route path="/crear-cita" element={<AppointmentForm />} />
        <Route path="/formulario-persona" element={< PersonalDataForm/>} />
        <Route path="/consultar-citas" element={<div>Consulta de Citas</div>} />
    </Routes>
  )
}
