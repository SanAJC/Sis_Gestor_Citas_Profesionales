import React from "react";
import { useEffect, useState } from "react";
import "./citas.css";
import Sidebar from "../Sidebar/Sidebar.jsx";
import { useAuth } from '../../context/AuthContext.jsx';
import reservationService from "../../services/reservationService.js";

const Citas = () => {
    const { user } = useAuth();
    const [citas, setCitas] = useState([]);
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(true);

    const cargarCitas = async () => {
        try {
            const datos = await reservationService.getUserReservations();
            setCitas(datos);
        } catch (e) {
            console.error("Error al cargar reservas: ", e);
            setError("No se pudieron cargar las citas. Por favor, intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            cargarCitas();
        }
    }, [user]);

    
    const getEstadoClass = (estado) => {
        switch (estado) {
            case "P": return "estado-pendiente";
            case "A": return "estado-aceptada";
            case "R": return "estado-rechazada";
            case "C": return "estado-cancelada";
            default: return "";
        }
    };

   
    const getEstadoText = (estado) => {
        switch (estado) {
            case "P": return "Pendiente";
            case "A": return "Aceptada";
            case "R": return "Rechazada";
            case "C": return "Cancelada";
            default: return "Desconocido";
        }
    };

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <h2>Mis Citas</h2>

                {loading && <div className="loading-message">
                    <div className="spinner"></div>
                    <p>Cargando tus citas...</p>
                </div>}
                
                {error && <div className="error-message">
                    <p>{error}</p>
                </div>}

                {!loading && citas.length === 0 && (
                    <div className="empty-message">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 2V6" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 2V6" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 10H21" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p>No tienes citas registradas</p>
                        <p className="empty-subtitle">Cuando reserves una cita, aparecerá aquí</p>
                    </div>
                )}

                {!loading && citas.length > 0 && (
                    <ul className="citas-list">
                        {citas.map((cita) => (
                            <li key={cita.id} className="cita-card">
                                <div className="cita-header">
                                    <span className={`cita-estado ${getEstadoClass(cita.estado)}`}>
                                        {getEstadoText(cita.estado)}
                                    </span>
                                </div>
                                
                                <div className="cita-fecha">
                                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                
                                <div className="cita-hora">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="#3498db" strokeWidth="2"/>
                                        <path d="M12 6V12L16 14" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    {cita.hora_inicio} - {cita.hora_fin}
                                </div>
                                
                                {cita.servicio && (
                                    <div className="cita-info">
                                        <div className="cita-info-item">
                                            <span className="cita-info-label">Servicio:</span>
                                            <span className="cita-info-value">{cita.servicio}</span>
                                        </div>
                                        
                                        {cita.profesional && (
                                            <div className="cita-info-item">
                                                <span className="cita-info-label">Profesional:</span>
                                                <span className="cita-info-value">{cita.profesional}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Citas;
