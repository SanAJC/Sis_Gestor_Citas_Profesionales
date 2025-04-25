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
    
    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [citasPerPage] = useState(4);

    const cargarCitas = async () => {
        try {
            const datos = await reservationService.getUserReservations();
            console.log("Datos de citas: ", datos);
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

    // Cálculos para la paginación
    const indexOfLastCita = currentPage * citasPerPage;
    const indexOfFirstCita = indexOfLastCita - citasPerPage;
    const currentCitas = citas.slice(indexOfFirstCita, indexOfLastCita);
    const totalPages = Math.ceil(citas.length / citasPerPage);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    // Ir a la página anterior
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    // Ir a la página siguiente
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const getEstadoClass = (estado) => {
        switch (estado) {
            case "P": return "cita-estado-pendiente";
            case "A": return "cita-estado-aceptada";
            case "R": return "cita-estado-rechazada";
            case "C": return "cita-estado-cancelada";
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
                <div className="cita-header-container">
                    <h2>Mis Citas</h2>
                    <div className="cita-counter">
                        {!loading && citas.length > 0 && (
                            <span className="cita-counter-badge">{citas.length} {citas.length === 1 ? 'cita' : 'citas'}</span>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="cita-loading-message">
                        <div className="cita-spinner"></div>
                        <p>Cargando tus citas...</p>
                    </div>
                )}
                
                {error && (
                    <div className="cita-error-message">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && citas.length === 0 && (
                    <div className="cita-empty-message">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 2V6" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 2V6" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 10H21" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p>No tienes citas registradas</p>
                        <p className="cita-empty-subtitle">Cuando reserves una cita, aparecerá aquí</p>
                    </div>
                )}

                {!loading && citas.length > 0 && (
                    <>
                        <div className="cita-list-container">
                            {currentCitas.map((cita) => (
                                <div key={cita.id} className="cita-item-card">
                                    <div className="cita-item-header">
                                        <span className={`cita-item-estado ${getEstadoClass(cita.estado)}`}>
                                            {getEstadoText(cita.estado)}
                                        </span>
                                    </div>
                                    
                                    <div className="cita-item-fecha">
                                        {new Date(cita.fecha).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    
                                    <div className="cita-item-hora">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="#3498db" strokeWidth="2"/>
                                            <path d="M12 6V12L16 14" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        {cita.hora_inicio} - {cita.hora_fin}
                                    </div>
                                    
                                    {cita.servicio && (
                                        <div className="cita-item-info">
                                            <div className="cita-item-info-row">
                                                <span className="cita-item-info-label">Servicio:</span>
                                                <span className="cita-item-info-value">{cita.servicio}</span>
                                            </div>
                                            
                                            {cita.profesional && (
                                                <div className="cita-item-info-row">
                                                    <span className="cita-item-info-label">Profesional:</span>
                                                    <span className="cita-item-info-value">{cita.profesional}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Paginación mejorada */}
                        {totalPages > 1 && (
                            <div className="cita-pagination-container">
                                <button 
                                    className={`cita-pagination-button ${currentPage === 1 ? 'cita-disabled' : ''}`}
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    aria-label="Página anterior"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                
                                <div className="cita-pagination-numbers">
                                    {Array.from({ length: totalPages }, (_, i) => {
                                        if (
                                            i + 1 === 1 || // Primera página
                                            i + 1 === totalPages || // Última página
                                            (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1) // Páginas cercanas a la actual
                                        ) {
                                            return (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => paginate(i + 1)}
                                                    className={`cita-pagination-number ${currentPage === i + 1 ? 'cita-active' : ''}`}
                                                    aria-label={`Página ${i + 1}`}
                                                    aria-current={currentPage === i + 1 ? "page" : undefined}
                                                >
                                                    {i + 1}
                                                </button>
                                            );
                                        } else if (
                                            (i + 1 === currentPage - 2 && currentPage > 3) ||
                                            (i + 1 === currentPage + 2 && currentPage < totalPages - 2)
                                        ) {
                                            // Mostrar puntos suspensivos
                                            return <span key={i + 1} className="cita-pagination-ellipsis">•••</span>;
                                        }
                                        return null;
                                    })}
                                </div>
                                
                                <button 
                                    className={`cita-pagination-button ${currentPage === totalPages ? 'cita-disabled' : ''}`}
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    aria-label="Siguiente página"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Citas;