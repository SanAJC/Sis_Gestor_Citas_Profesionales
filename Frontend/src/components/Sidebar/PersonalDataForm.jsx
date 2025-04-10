import React, { useState } from 'react';
import './PersonalDataForm.css';

const PersonalDataForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    professional: ''
  });

  const professionals = [
    { id: 1, name: 'Dr. Juan Pérez - Medicina General' },
    { id: 2, name: 'Dra. María García - Pediatría' },
    { id: 3, name: 'Dr. Carlos López - Cardiología' },
    { id: 4, name: 'Dra. Ana Martínez - Dermatología' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="personal-data-form-container">
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

        <div className="form-group">
          <select
            id="professional"
            name="professional"
            value={formData.professional}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un Profesional</option>
            {professionals.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">
          RESERVAR
        </button>
      </form>
    </div>
  );
};

export default PersonalDataForm;