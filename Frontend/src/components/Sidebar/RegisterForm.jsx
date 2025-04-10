import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import { FcGoogle } from 'react-icons/fc';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    telefono: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      // Redirigir al login después de un registro exitoso
      navigate('/login', { state: { message: 'Registro exitoso. Inicia sesión.' } });
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };
 

  const handleGoogleRegister = () => {
    // Aquí irá la lógica de registro con Google
    console.log('Google register clicked');
    // Si el registro con Google es exitoso, redirigir al usuario a la aplicación
    // navigate("/app");
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div className="register-form-content">
          <h1>Crea tu Cuenta</h1>
          <p className="register-subtitle">Tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nombre_usuario"
                placeholder="Nombre_Usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="telefono"
                placeholder="Numero de teléfono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="register-button">
              Continuar
            </button>
          </form>

          <div className="divider">
            <span>O inicia sesión con tu cuenta de Google</span>
          </div>

          <button 
            className="google-button"
            onClick={handleGoogleRegister}
          >
            <FcGoogle className="google-icon" />
            Continuar con Google
          </button>
        </div>
      </div>
      <div className="register-illustration">
        {}
      </div>
    </div>
  );
};

export default RegisterForm;