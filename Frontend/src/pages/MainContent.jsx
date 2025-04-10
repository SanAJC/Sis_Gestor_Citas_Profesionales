import { Link, Routes, Route } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import "../main-content.css";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import "../App.css";



export const HomePage = () => (
  <>
    <div className="app-container">
      <Sidebar/>
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
            <p>Actualmente, tienes 0 cita(s) agendada(s) en tu historial.</p>
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
  </>
);

