import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; //debes instalarla con npm install react-toastify

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Obtener eventos del backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('http://localhost:3001/eventos');
        if (!response.ok) {
          throw new Error('Error al obtener eventos');
        }
        const data = await response.json();
        setEventos(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventos();

    // Mostrar notificación si viene de crear/editar un evento
    if (location.state?.eventoCreado) {
      toast.success('Evento creado correctamente!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Limpiar el estado de navegación
      navigate(location.pathname, { replace: true });
    } else if (location.state?.eventoActualizado) {
      toast.success('Evento actualizado correctamente!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const handleEditarEvento = (eventoId) => {
    navigate(`/eventos/${eventoId}`);
  };

  if (isLoading) {
    return <div className="text-center my-5">Cargando eventos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger my-5">Error: {error}</div>;
  }

  return (
    <div className="eventos-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <ToastContainer />

      <header className="eventos-header">
        <img src="/ruta-al-logo.png" alt="Logo Zig-Zag" className="logo" />
        <h1><strong>Eventos</strong></h1>
        <a href="/ReservasGenerales" className="reservas-link">Reservas</a>
      </header>

      <div className="agregar-evento" style={{ textAlign: 'right', marginBottom: '20px' }}>
        <a href="/eventos" style={{ 
          backgroundColor: '#22a31f', 
          color: 'white', 
          padding: '10px 15px', 
          borderRadius: '5px', 
          textDecoration: 'none',
          display: 'inline-block'
        }}>+ Agregar evento</a>
      </div>

      {eventos.length === 0 ? (
        <div className="alert alert-info">No hay eventos registrados</div>
      ) : (
        eventos.map((evento) => (
          <div className="evento-card" key={evento.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="evento-banner" style={{ marginBottom: '2px' }}>
              <h4 style={{ marginBottom: '15px' }}><b>{evento.nombre}</b></h4>
              <p>Banner de evento:</p>
              <div className="imagenes-banner" style={{ 
                display: 'flex', 
                gap: '20px', 
                marginTop: '20px',
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '5px',
                justifyContent: 'center'
              }}>
                {evento.baner ? (
                  <img 
                    src={evento.baner} 
                    alt={`Banner de ${evento.nombre}`}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                <div style={{ textAlign: 'center' }}>
                    <p>No hay banner disponible</p>
                  </div>
                )}
              </div>
            </div>
            <div className="evento-descripcion" style={{ marginBottom: '20px' }}>
              <p className="disfrutar" style={{ fontWeight: 'bold', marginBottom: '10px' }}><b>Podrás disfrutar de:</b></p>
              <p className="descripcion" style={{ marginBottom: '15px' }}>
                {evento.descripcion || 'No hay descripción disponible'}
              </p>
              <p className="duracion" style={{ marginBottom: '0' }}>
                <b>Duración del evento:</b><br />
                {new Date(evento.fechaInicio).toLocaleDateString()} - {new Date(evento.fechaFinal).toLocaleDateString()}
              </p>
              <p style={{ marginTop: '10px' }}>
                <b>Lugar:</b> {evento.lugar || 'No especificado'}
              </p>
            </div>
            <div className="editar-evento" style={{ textAlign: 'right' }}>
              <button 
                onClick={() => handleEditarEvento(evento.id)}
                style={{ 
                  color: '#22a31f', 
                  textDecoration: 'underline',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer'
                }}
              >
                Editar evento
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Eventos;