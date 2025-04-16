import React, { useState } from 'react';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasenaActual: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <h2>EDITA TU PERFIL</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">NOMBRE</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Juan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">APELLIDO</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Arias"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="rimel1111@gmail.com"
          />
        </div>

        <div className="password-section">
          <h3>CAMBIOS DE CONTRASEÑA</h3>
          <div className="form-group">
            <input
              type="password"
              id="contrasenaActual"
              name="contrasenaActual"
              value={formData.contrasenaActual}
              onChange={handleChange}
              placeholder="Contraseña actual"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="nuevaContrasena"
              name="nuevaContrasena"
              value={formData.nuevaContrasena}
              onChange={handleChange}
              placeholder="Nueva contraseña"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="save-button">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
