import { Link, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import "../main-content.css";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";

export const HomePage = () => {
  const location = useLocation();
  let mensaje = location.state?.mensaje;
  useEffect(() => {
    if(mensaje !== ""){
      toast.success(mensaje);
    }
   
  }, []);

  return (
    <div className="app-container">
      <div>
        <ToastContainer />
      </div>

      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>Sistema Gestor de Citas</h1>
          <div className="header-icons">
            <NotificationsIcon />
            <PersonIcon />
          </div>
        </div>
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>Bienvenido/a</h2>
            <p>Consulta tus citas agendadas con tu profesional aqui.</p>
            <p>
              Recuerda que puedes gestionar, modificar o programar nuevas citas
              en cualquier momento. ¡Gracias por confiar en nosotros para
              organizar tu tiempo!
            </p>
            <div className="action-buttons">
              <Link to="/crear-cita" className="create-button">
                Crear cita
              </Link>
              <Link to="/consultar-citas" className="consult-button">
                Consultar cita(s)
              </Link>
            </div>
          </div>
          <div className="welcome-image">
            <img src="/src/assets/inicio.png" alt="Ilustración de citas" />
          </div>
        </div>
      </div>
    </div>
  );
};
