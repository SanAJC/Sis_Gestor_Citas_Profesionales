import React, { useEffect, useState } from 'react';
import './EditProfile.css';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { FaUser, FaEnvelope, FaSave, FaTimes, FaCalendarAlt, FaBell } from 'react-icons/fa';

const EditProfile = () => {
  const { user } = useAuth();
  const [googleAccountStatus, setGoogleAccountStatus] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    notificaciones: true
  });

  useEffect(() => {
    
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log('Datos del formulario:', formData);
    
    alert('Perfil actualizado con éxito');
  };

  useEffect(() => {
    const checkGoogleStatus = async () => {
      if (user) {
        try {
          const response = await authService.google_account_status(user);
          setGoogleAccountStatus(response);
          console.log('Google account status:', response);
        } catch (error) {
          console.error('Error checking Google account status:', error);
        }
      }
    };

    checkGoogleStatus();
  }, [user]);

  return (
    <div className="edit-profile-container">
      <div className="profile-card">
        <div className="card-accent"></div>
        <div className="accent-circle accent-circle-1"></div>
        <div className="accent-circle accent-circle-2"></div>
        
        <div className="profile-header">
          <h2>Mi Perfil</h2>
          <p>Gestiona tu información personal </p>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="username">Nombre de Usuario</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Tu nombre de usuario"
                  />
                  <div className="input-icon">
                    <FaUser />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                />
                <div className="input-icon">
                  <FaEnvelope />
                </div>
              </div>
            </div>
            
            <div className="checkbox-container">
              <label htmlFor="notificaciones" className="checkbox-label">
                <div className="checkbox-custom">
                  <input
                    type="checkbox"
                    id="notificaciones"
                    name="notificaciones"
                    checked={formData.notificaciones}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </div>
                <span className="checkbox-text">Recibir notificaciones de citas médicas</span>
                <FaBell className="notification-icon" />
              </label>
            </div>
          </div>

          {!googleAccountStatus && (
            <div className="google-connect-section">
              <h3>Sincroniza tu calendario con Google Calendar</h3>
              <p>Inicia sesión con tu cuenta de Google para gestionar tus citas en tu calendario</p>
              <button 
                className="google-button"
                type="button"
                onClick={() =>
                  window.location.href = "http://127.0.0.1:8000/connect-google-account/"
                }
              >
                <FcGoogle className="google-icon" />
                <span>Conectar con Google</span>
              </button>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button">
              <FaTimes /> Cancelar
            </button>
            <button type="submit" className="save-button">
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;