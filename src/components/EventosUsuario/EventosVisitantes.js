import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Comp_encabezado } from '../Comp/Comp_encabezado';
import { Comp_Pie_pagina } from '../Comp/Comp_Pie_pagina';
import { API_BASE_URL } from "../../config/api";

// Función para resolver URLs de imágenes correctamente
const resolveImageUrl = (url) => {
  if (!url) return null;
  // Si es una data URL (base64), devolverla tal cual
  if (url.startsWith('data:')) return url;
  // Si es una URL de uploads relativa, agregarle la base URL del API
  if (url.startsWith('/uploads')) return `${API_BASE_URL}${url}`;
  // Si ya tiene protocolo, devolverla tal cual
  if (url.startsWith('http')) return url;
  // Si es cualquier otra ruta, agregarle la base URL
  return `${API_BASE_URL}${url}`;
};

const EventosSeleccionar = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Obtener usuario del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUsuario(parsedUser);
      obtenerEventosDisponibles(parsedUser.id);
    } else {
      setCargando(false);
      setError('Usuario no identificado. Por favor inicia sesión.');
    }
  }, []);

  const obtenerEventosDisponibles = async (idVisitante) => {
    try {
      const token = localStorage.getItem("tokenUsuario");
      const respuesta = await fetch(`${API_BASE_URL}/eventos/disponibles/${idVisitante}`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        });

      if (!respuesta.ok) {
        // Si hay un error en la respuesta, intentar obtener todos los eventos
        if (respuesta.status === 404) {
          console.warn('Endpoint específico no disponible, usando endpoint general');
          return await obtenerTodosEventos();
        }
        throw new Error('Error al obtener eventos disponibles');
      }

      const datos = await respuesta.json();
      setEventos(datos);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerTodosEventos = async () => {
    try {
      const token = localStorage.getItem("tokenUsuario");
      const respuesta = await fetch(`${API_BASE_URL}/eventos`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        });
      if (!respuesta.ok) {
        throw new Error('Error al obtener eventos');
      }
      return await respuesta.json();
    } catch (err) {
      throw err;
    }
  };

  // Función para formatear fechas ISO a formato local
  const formatearFecha = (fechaISO) => {
    try {
      const fecha = new Date(fechaISO);
      if (isNaN(fecha)) return 'Fecha inválida';
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className='eventos-seleccionar-container'>
        <Comp_encabezado />

        <header className="eventos-header azul">
          <h1 className="text-white m-0">
            {usuario ? `Eventos Disponibles para ${usuario.nombre}` : 'Eventos Disponibles'}
          </h1>
        </header>

        <div className="eventos-container">
          <div className="sin-eventos-card">
            <div className="sin-eventos-content">
              <div className="sin-eventos-icon">
                <i className="bi bi-calendar-x"></i>
              </div>
              <h2 className="sin-eventos-title">No hay eventos disponibles</h2>
              <p className="sin-eventos-description">
                En este momento no hay eventos disponibles para tu participación.
              </p>
              <p className="sin-eventos-subtitle">
                Por favor, vuelve más tarde para ver los nuevos eventos.
              </p>
            </div>
          </div>
        </div>

        <Comp_Pie_pagina />
      </div>
    );
  }

  return (
    <div className='eventos-seleccionar-container'>
      <Comp_encabezado />

      <header className="eventos-header azul">
        <h1 className="text-white m-0">
          {usuario ? `Eventos Disponibles para ${usuario.nombre}` : 'Eventos Disponibles'}
        </h1>
      </header>

      <div className="eventos-container">
        {eventos.map((evento) => (
          <div className="evento-card" key={evento.id}>
            <div className="evento-banner">
              <h4><b>{evento.nombre}</b></h4>
              <p className="lugar-evento">
                <i className="bi bi-geo-alt-fill"></i> {evento.lugar}
              </p>
              <div className="imagenes-banner">
                <img
                  src={resolveImageUrl(evento.baner) || "/placeholder.png"}
                  alt={`Banner de ${evento.nombre}`}
                  className="img-banner"
                />
              </div>
            </div>

            <div className="evento-descripcion">
              <p className="disfrutar">
                <b><i className="bi bi-stars"></i> Podrás disfrutar de:</b>
              </p>
              <p className="descripcion">
                {evento.descripcion || "Descripción no disponible"}
              </p>
              <div className="duracion-container">
                <p className="duracion">
                  <b><i className="bi bi-calendar-event"></i> Duración del evento:</b>
                </p>
                <div className="fechas">
                  <span className="fecha-inicio">
                    <b>Inicio:</b> {formatearFecha(evento.fechaInicio)}
                  </span>
                  <span className="fecha-final">
                    <b>Fin:</b> {formatearFecha(evento.fechaFinal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="seleccionar-evento">
              <Link
                to={{
                  pathname: `/eventos-descripcion/${evento.id}`,
                  state: { user: JSON.parse(localStorage.getItem('user')) }
                }}
                className="btn-seleccionar"
              >
                <i className="bi bi-calendar-plus"></i> Seleccionar evento
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Comp_Pie_pagina />
    </div>
  );
};

export default EventosSeleccionar;