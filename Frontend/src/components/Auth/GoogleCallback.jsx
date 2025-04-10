// Componente GoogleCallback.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getAuthData = async () => {
      try {
        // Extraer el código de autorización de la URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        console.log(code);
        
        if (code) {
          // Enviar el código al backend para obtener tokens
          const response = await axios.post('http://localhost:8000/api/auth/google/login/', {
            code: code,
          });
          console.log(response);
          // Guardar tokens en localStorage (ajustar según la respuesta real)
          localStorage.setItem('access_token', response.data.access_token || response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh_token || response.data.refresh);
          
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Redireccionar al dashboard u otra página
            navigate('/app');
          }

          return response.data;
          
        } 
      } catch (error) {
        console.error('Error al autenticar con Google:', error);
        console.error('Detalles del error:', error.response?.data);
        setError(`Error al procesar la autenticación con Google: ${error.response?.data?.error || error.message}`);
      }
    };

    getAuthData();
  }, []);

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-md">
      <h3 className="font-bold">Error de autenticación</h3>
      <p>{error}</p>
    </div>;
  }

  return <div className="p-4 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
    <p>Procesando autenticación con Google...</p>
  </div>;
};

export default GoogleCallback;