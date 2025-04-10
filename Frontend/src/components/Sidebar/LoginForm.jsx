import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { FcGoogle } from 'react-icons/fc';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      await authService.login(formData);
      navigate('/dashboard'); // Redirige al usuario al dashboard después del login
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    
    // Guardar un indicador simple de autenticación
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirigir al usuario a la página principal con el menú
    navigate('/app');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form-content">
          <h1>Inicio de sesión</h1>
          <p className="login-subtitle">No tienes cuenta? <Link to="/register">Crear</Link></p>
          
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="login-button">
              Continuar
            </button>
          </form>

          <div className="divider">
            <span>O inicia sesión con tu cuenta de Google</span>
          </div>

          <button 
            className="google-button"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="google-icon" />
            Continuar con Google
          </button>
        </div>
      </div>
      <div className="login-illustration">
        {/* Aquí iría tu ilustración o imagen */}
      </div>
    </div>
  );
};

export default LoginForm;