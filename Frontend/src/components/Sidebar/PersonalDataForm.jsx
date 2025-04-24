import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PersonalDataForm.css';
import { useAuth } from '../../context/AuthContext.jsx';
import reservationService from '../../services/reservationService.js';

const PersonalDataForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Obtener los datos de la reserva pasados desde AppointmentForm
  const { reservationData, appointmentDetails } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Si no hay datos de reserva, redirigir a la página de selección de cita
  useEffect(() => {
    if (!reservationData || !appointmentDetails) {
      navigate('/agendar-cita');
    }
  }, [reservationData, appointmentDetails, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reservationData) {
      setError("No se encontraron los datos de la reserva. Por favor, intente nuevamente.");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Combinar los datos del formulario con los datos de la reserva
      const completeReservationData = {
        ...reservationData,
        ...formData
      };
      
      console.log(completeReservationData);
      
      // Enviar la reservación completa al backend
      const response = await reservationService.createReservation(completeReservationData);
      // Redirigir a una página de confirmación o a la página de inicio
      navigate('/app', { 
        state: { 
          reservationId: response.id,
          appointmentDetails: appointmentDetails,
          personalData: formData,
          mensaje: "Reserva creada correctamente"
        } 
      });
      
    } catch (error) {
      console.error("Error al enviar la reserva:", error);
      setError("Ha ocurrido un error al enviar la reserva. Por favor intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Si no hay datos de reserva, mostrar mensaje de carga o redirigir
  if (!appointmentDetails) {
    return <div className="loading">Cargando datos de la cita...</div>;
  }

  return (
    <div className="personal-data-form-container">
      <div className="appointment-summary-box">
        <h3>Resumen de la Cita</h3>
        <p><strong>Fecha:</strong> {appointmentDetails.fecha}</p>
        <p><strong>Hora:</strong> {appointmentDetails.hora_inicio} - {appointmentDetails.hora_fin}</p>
        <p><strong>Profesional:</strong> {appointmentDetails.profesional.especialidad}</p>
        {appointmentDetails.profesional.user && (
          <p><strong>Nombre:</strong> {appointmentDetails.profesional.user.username || appointmentDetails.profesional.user.first_name}</p>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="personal-data-form">
        <h3 className="form-subtitle">NECESITAMOS ALGUNOS DATOS</h3>
        
        <div className="form-group">
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Nombre Completo"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Número Celular"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "PROCESANDO..." : "CONFIRMAR RESERVA"}
        </button>
      </form>
    </div>
  );
};

export default PersonalDataForm;