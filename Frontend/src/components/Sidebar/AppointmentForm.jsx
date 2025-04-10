import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppointmentForm.css";

const AppointmentScheduler = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);

  
  const professionals = [
    {
      id: 1,
      name: "Dr. Juan Esteban",
      specialty: "REACT",
      image: "/Frontend/src/assets/JUAN.png", 
      rating: 4.8,
      experience: "2 años"
    },
    {
      id: 2,
      name: "Dra. Santi Arias",
      specialty: "DJANGO",
      image: "/Frontend/src/assets/SANTI.png", 
      rating: 4.9,
      experience: "12 años"
    },
  
  ];


  const timeSlots = ["12:30 PM", "03:30 PM"];

  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date(2025, 3, 1); 
    const lastDay = new Date(2025, 4, 0).getDate(); 

    
    const firstDayOfMonth = new Date(2025, 3, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }


    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    return days;
  };

  const weekDays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  const handleDateSelect = (day) => {
    if (day !== null) {
      setSelectedDate(day);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
    setShowScheduler(true);
  };

  const handleScheduleAppointment = () => {
    if (selectedDate && selectedTime && selectedProfessional) {
      navigate("/formulario-persona");
     
    }
  };

  const handleCloseModal = () => {
  
    setShowScheduler(false); 
    console.log("Modal cerrado");
  };

  if (!showScheduler) {
    return (
      <div className="appointment-container">
        <div className="appointment-modal">
          <div className="modal-header">
            <h2>SELECCIONAR PROFESIONAL</h2>
          </div>

          <div className="professionals-grid">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className={`professional-card ${
                  selectedProfessional?.id === professional.id ? "selected" : ""
                }`}
                onClick={() => handleProfessionalSelect(professional)}
              >
                <div className="professional-image">
                  <img src={professional.image} alt={professional.name} />
                </div>
                <div className="professional-info">
                  <h3>{professional.name}</h3>
                  <p className="specialty">{professional.specialty}</p>
                  <div className="professional-details">
                    <span className="rating">
                      ⭐ {professional.rating}
                    </span>
                    <span className="experience">
                      {professional.experience} de experiencia
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            <img src={selectedProfessional.image} alt={selectedProfessional.name} />
          </div>
          <div className="professional-info">
            <h3>{selectedProfessional.name}</h3>
            <p className="specialty">{selectedProfessional.specialty}</p>
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
                    }`}
                    onClick={() => handleDateSelect(day)}
                  >
                    {day}
                  </button>
                )
              )}
            </div>
            <div className="time-selection-container">
              {selectedDate && (
                <div className="time-selection">
                  <h4>Horarios Disponibles</h4>
                  <div className="time-slots">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={`time-slot ${
                          selectedTime === time ? "selected" : ""
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="appointment-summary">
                  <h4>Resumen</h4>
                  <div className="summary-content">
                    <p>Fecha: {selectedDate} de Abril, 2025</p>
                    <p>Hora: {selectedTime}</p>
                  </div>
                  <button
                    className="schedule-button"
                    onClick={handleScheduleAppointment}
                  >
                    Confirmar Cita
                  </button>
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