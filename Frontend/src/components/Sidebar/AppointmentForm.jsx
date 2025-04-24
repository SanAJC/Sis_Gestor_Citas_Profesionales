import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AppointmentForm.css";
import { useAuth } from "../../context/AuthContext.jsx";
import reservationService from "../../services/reservationService.js";

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [profesionales, setProfesionales] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar profesionales cuando el componente se monta
  useEffect(() => {
    if (user) {
      cargarProfesionales();
    }
  }, [user]);

  // Generar horarios disponibles cuando se selecciona fecha y profesional
  useEffect(() => {
    if (selectedDate && selectedProfessional) {
      generarHorariosDisponibles();
    }
  }, [selectedDate, selectedProfessional]);

  const cargarProfesionales = async () => {
    try {
      setLoading(true);
      const datos = await reservationService.getProfessionals();
      setProfesionales(datos);
    } catch (e) {
      console.error("Error al cargar profesionales: ", e);
      setError(
        "No se pudieron cargar los profesionales. Por favor, intenta más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el día de la semana en español en base a la fecha seleccionada
  const getDayOfWeek = (day) => {
    const date = new Date(2025, 3, day); // Abril 2025
    const dayOfWeek = date.getDay(); // 0 = domingo, 1 = lunes, etc.
    
    // Mapeo del número de día a nombre en español
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    return dias[dayOfWeek];
  };

  // Genera lista de horarios disponibles basados en horario_atencion del profesional
  const generarHorariosDisponibles = async () => {
    try {
      if (!selectedProfessional || !selectedProfessional.horario_atencion) {
        setAvailableTimeSlots([]);
        return;
      }
      
      // Obtener el día de la semana en español para la fecha seleccionada
      const diaSemana = getDayOfWeek(selectedDate);
      
      // Verificar si hay horarios disponibles para ese día
      if (!selectedProfessional.horario_atencion[diaSemana]) {
        setAvailableTimeSlots([]);
        return;
      }
      
      // Obtener las franjas horarias para ese día
      const franjasHorarias = selectedProfessional.horario_atencion[diaSemana];
      
      // Generar slots de tiempo disponibles en intervalos de 1 hora
      const slots = [];
      
      franjasHorarias.forEach(franja => {
        // Cada franja tiene formato "HH:MM-HH:MM"
        const [inicio, fin] = franja.split('-');
        
        // Convertir a horas y minutos
        let [horaInicio, minInicio] = inicio.split(':').map(Number);
        const [horaFin, minFin] = fin.split(':').map(Number);
        
        // Crear slots de 1 hora dentro de la franja
        while (horaInicio < horaFin || (horaInicio === horaFin && minInicio < minFin)) {
          // Añadir el slot en formato "HH:MM"
          slots.push(`${String(horaInicio).padStart(2, '0')}:${String(minInicio).padStart(2, '0')}`);
          
          // Avanzar 1 hora
          horaInicio++;
          
          // Si llegamos a la hora de fin, paramos
          if (horaInicio > horaFin || (horaInicio === horaFin && minInicio >= minFin)) {
            break;
          }
        }
      });
      
      // En un sistema real, aquí verificaríamos si hay citas existentes para filtrar los slots ocupados
      // Por ahora, usamos todos los slots generados
      
      setAvailableTimeSlots(slots);
    } catch (e) {
      console.error("Error al generar horarios disponibles:", e);
      setError("No se pudieron cargar los horarios disponibles.");
    }
  };

  const generateCalendarDays = () => {
    const days = [];
    const lastDay = new Date(2025, 4, 0).getDate(); // Último día de abril

    const firstDayOfMonth = new Date(2025, 3, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Días vacíos para alinear correctamente el calendario
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    // Días del mes
    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    return days;
  };

  const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  const handleDateSelect = (day) => {
    if (day !== null) {
      setSelectedDate(day);
      setSelectedTime(null); // Reinicia el tiempo seleccionado cuando cambia la fecha
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
    setShowScheduler(true);
  };

  // Calcular la hora de finalización (1 hora después)
  const calcularHoraFin = (horaInicio) => {
    const [hours, minutes] = horaInicio.split(':').map(Number);
    let newHours = hours + 1;
    return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleScheduleAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedProfessional || !user) {
      setError("Por favor completa todos los campos necesarios.");
      return;
    }

    try {
      setSubmitting(true);
      
      // Crear fecha en formato ISO para el backend
      const year = 2025;
      const month = 3; // Abril (0-indexado)
      const day = selectedDate;
      const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Calcular hora de fin (1 hora después)
      const horaFin = calcularHoraFin(selectedTime);
      
      // Preparar los datos de la reservación para pasarlos al siguiente formulario
      const reservationData = {
        cliente: user.id,
        profesional: selectedProfessional.id,
        fecha: formattedDate,
        hora_inicio: `${selectedTime}:00`,
        hora_fin: `${horaFin}:00`,
        estado: 'P' 
      };
      
      // Redireccionar con los detalles de la cita
      navigate("/formulario-persona", { 
        state: { 
          reservationData: reservationData,
          appointmentDetails: {
            fecha: formattedDate,
            hora_inicio: selectedTime,
            hora_fin: horaFin,
            profesional: selectedProfessional
          } 
        } 
      });
    } catch (error) {
      console.error("Error al preparar cita:", error);
      setError("Ha ocurrido un error al preparar la cita. Por favor intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowScheduler(false);
  };

  // Si estamos en la pantalla de selección de profesional
  if (!showScheduler) {
    return (
      <div className="appointment-container">
        <div className="appointment-modal">
          <div className="modal-header">
            <h2>SELECCIONAR PROFESIONAL</h2>
          </div>
          {loading ? (
            <div className="loading-indicator">Cargando profesionales...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="professionals-grid">
              {profesionales.map((profesional) => (
                <div
                  key={profesional.id}
                  className={`professional-card ${
                    selectedProfessional?.id === profesional.id ? "selected" : ""
                  }`}
                  onClick={() => handleProfessionalSelect(profesional)}
                >
                  {profesional.especialidad}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const baseURL = "http://localhost:8000";
  const imageUrl = `${baseURL}${selectedProfessional.avatar}`;

  // Pantalla de programación de cita
  return (
    <div className="appointment-container">
      <div className="appointment-modal">
        <div className="modal-header">
          <h2>AGENDAR CITA</h2>
          <button className="close-button" onClick={handleCloseModal}>
            ×
          </button>
        </div>

        <div className="selected-professional">
          <div className="professional-image">
            {selectedProfessional.avatar ? (
              <img
                src={imageUrl}
                alt={selectedProfessional.name || selectedProfessional.especialidad}
              />
            ) : (
              <div className="placeholder-image">{selectedProfessional.especialidad.charAt(0)}</div>
            )}
          </div>
          <div className="professional-info">
            <h3>{selectedProfessional.user.username || selectedProfessional.user?.first_name || selectedProfessional.especialidad}</h3>
            <p className="specialty">{selectedProfessional.especialidad}</p>
          </div>
        </div>

        <div className="calendar-section">
          <div className="month-navigation">
            <h3>Abril 2025</h3>
          </div>

          <div className="calendar-and-time-container">
            <div className="calendar-grid">
              {weekDays.map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((day, index) =>
                day === null ? (
                  <div key={`empty-${index}`} className="empty-day"></div>
                ) : (
                  <button
                    key={day}
                    className={`calendar-day ${
                      selectedDate === day ? "selected" : ""
                    } ${
                      // Verificar si el profesional atiende este día
                      selectedProfessional?.horario_atencion &&
                      !selectedProfessional.horario_atencion[getDayOfWeek(day)]
                        ? "unavailable"
                        : ""
                    }`}
                    onClick={() => handleDateSelect(day)}
                    disabled={
                      selectedProfessional?.horario_atencion &&
                      !selectedProfessional.horario_atencion[getDayOfWeek(day)]
                    }
                  >
                    {day}
                  </button>
                )
              )}
            </div>
            <div className="time-selection-container">
              {selectedDate && (
                <div className="time-selection">
                  <h4>Horarios Disponibles para {selectedDate} de Abril</h4>
                  <p className="selected-day">
                    {getDayOfWeek(selectedDate).charAt(0).toUpperCase() + getDayOfWeek(selectedDate).slice(1)}
                  </p>
                  <div className="time-slots">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          className={`time-slot ${
                            selectedTime === time ? "selected" : ""
                          }`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      ))
                    ) : (
                      <p className="no-slots">No hay horarios disponibles para este día</p>
                    )}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="appointment-summary">
                  <h4>Resumen de la Cita</h4>
                  <div className="summary-content">
                    <p>Fecha: {selectedDate} de Abril, 2025</p>
                    <p>Día: {getDayOfWeek(selectedDate).charAt(0).toUpperCase() + getDayOfWeek(selectedDate).slice(1)}</p>
                    <p>Hora: {selectedTime} - {calcularHoraFin(selectedTime)}</p>
                    <p>Profesional: {selectedProfessional.especialidad}</p>
                  </div>
                  <button
                    className="schedule-button"
                    onClick={handleScheduleAppointment}
                    disabled={submitting}
                  >
                    {submitting ? "Procesando..." : "Confirmar Cita"}
                  </button>
                  {error && <p className="error-message">{error}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;