import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, user, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);
  
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
      await register(formData);
      // Redirigir al login después de un registro exitoso
      navigate('/login', { state: { message: 'Registro exitoso. Inicia sesión.' } });
    } catch (err) {
      setError(err.message || authError || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };
 
  const handleGoogleRegister = () => {
    // La autenticación con Google requiere implementación adicional
    // que conecte con el backend de Django
    alert('El registro con Google está en desarrollo');
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
                name="username"
                placeholder="Nombre_Usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Numero de teléfono"
                value={formData.phone}
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