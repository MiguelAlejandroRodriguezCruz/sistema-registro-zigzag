import React, { useState, useEffect, useRef } from "react"; // Agrega useRef
import { useParams } from "react-router-dom";
import { Comp_encabezado } from "./Comp_encabezado";
import { Comp_Pie_pagina } from "./Comp_Pie_pagina";
import { QRCodeCanvas } from 'qrcode.react';
import "../style/EventosDescripcion.css"

const EventosDescripcion = () => {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  // Estados para el formulario
  const [fechaEvento, setFechaEvento] = useState("");
  const [numAdultos, setNumAdultos] = useState("");
  const [numNinos, setNumNinos] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [user, setUser] = useState(null);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);
  const [imagenExpandida, setImagenExpandida] = useState(false);


  const [mostrarQR, setMostrarQR] = useState(false);
  const [idReserva, setIdReserva] = useState(null);
  const [qrValue, setQrValue] = useState("");

  const intervalRef = useRef(null); // ← Referencia al interval

  // Función para formatear fechas (igual que en EventosSeleccionar)
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

  const cambiarImagen = (nuevoIndex) => {
  setIndiceImagenActual(nuevoIndex);

  // Reinicia el intervalo
  clearInterval(intervalRef.current);
  intervalRef.current = setInterval(() => {
    setIndiceImagenActual((prev) => (prev + 1) % imagenes.length);
  }, 3000);
};


  useEffect(() => {
    // Recuperar usuario del localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const cargarEvento = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3001/eventos/${id}`);
        if (!respuesta.ok) {
          throw new Error('Error al cargar el evento');
        }
        const datos = await respuesta.json();
        setEvento(datos);

        // Cargar imágenes adicionales del evento
        const imagenesResponse = await fetch(`http://localhost:3001/eventos/${id}/imagenes`);
        if (!imagenesResponse.ok) {
          throw new Error('Error al cargar las imágenes del evento');
        }
        const imagenesData = await imagenesResponse.json();
        setImagenes(imagenesData);

        // Inicializar respuestas del formulario
        try {
          const formularioParseado = JSON.parse(datos.formulario || "[]");
          const respuestasIniciales = {};
          formularioParseado.forEach(campo => {
            if (campo.type === 'checkbox') {
              respuestasIniciales[campo.id] = campo.options ? [] : false;
            } else {
              respuestasIniciales[campo.id] = '';
            }
          });
          setRespuestas(respuestasIniciales);
        } catch (e) {
          console.error("Error al inicializar respuestas:", e);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id]);

  useEffect(() => {
    if (imagenes.length === 0) return;

    const iniciarIntervalo = () => {
      intervalRef.current = setInterval(() => {
        setIndiceImagenActual((prev) => (prev + 1) % imagenes.length);
      }, 3000);
    };

    iniciarIntervalo();

    return () => clearInterval(intervalRef.current);
  }, [imagenes]);


  // Manejar cambios en campos dinámicos
  const handleCampoChange = (campoId, value) => {
    setRespuestas({
      ...respuestas,
      [campoId]: value
    });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErrorFormulario("");
    setMensajeExito("");

    try {
      if (!fechaEvento) throw new Error("Por favor seleccione una fecha para el evento");
      if (numAdultos <= 0 && numNinos <= 0) throw new Error("Debe adquirir al menos un boleto");
      if (!user) {
        throw new Error("Debes iniciar sesión para realizar reservas");
      }

      const datosFormulario = {
        id_visitante: user.id,
        id_evento: evento.id,
        formulario: JSON.stringify(respuestas),
        fecha_evento: fechaEvento,
        num_adultos: parseInt(numAdultos) || 0,
        num_ninos: parseInt(numNinos) || 0
      };

      const respuesta = await fetch('http://localhost:3001/formulario/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormulario)
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || 'Error al guardar formulario');

      setMensajeExito('¡Formulario guardado exitosamente!');
      setQrValue(resultado.codigo_qr);  // lo que viene de la BD
      setMostrarQR(true);

    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setEnviando(false);
    }
  };



  if (cargando) {
    return (
      <div className="cargando-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando información del evento...</p>
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

  if (!evento) {
    return (
      <div className="sin-eventos">
        <div className="alert alert-info" role="alert">
          Evento no encontrado
        </div>
      </div>
    );
  }

  // Parsear el formulario JSON
  let formularioParseado = [];
  try {
    formularioParseado = JSON.parse(evento.formulario || "[]");
  } catch (e) {
    console.error("Error al parsear el formulario:", e);
  }

  return (
    <div className="mt-4 eventos-descripcion-container">
      <Comp_encabezado />
      <header className="eventos-header azul">
        <h1 className="text-white m-0">{evento.nombre}</h1>
      </header>

      <div className="eventos-container">
        <div className="evento-card">
          <div className="evento-info">
            <div className="evento-imagenes">
              {/* Banner principal */}
              <div className="banner-grande">
                <img
                  src={evento.baner || "/placeholder.png"}
                  alt={`Banner de ${evento.nombre}`}
                  className="img-banner"
                />
              </div>

              {/* Imágenes adicionales */}
              <div className="img-small-grid">
                {imagenes.length > 0 && (
                  <div className="carrusel-contenedor">
                    <div className="img-small-container" onClick={() => setImagenExpandida(true)} style={{ cursor: 'pointer' }}>
                      <img
                        src={imagenes[indiceImagenActual].ruta_imagen}
                        alt={`Imagen ${indiceImagenActual + 1} de ${evento.nombre}`}
                        className="img-small"
                      />
                    </div>

                    {/* Controles de navegación */}
                    <div className="carrusel-controles">
                      <button
                        className="carrusel-btn"
                        onClick={() =>
                          cambiarImagen(indiceImagenActual === 0 ? imagenes.length - 1 : indiceImagenActual - 1)
                        }
                      >
                        «
                      </button>

                      {imagenes.map((_, index) => (
                        <button
                          key={index}
                          className={`carrusel-indicador ${
                            index === indiceImagenActual ? "activo" : ""
                          }`}
                          onClick={() => cambiarImagen(index)}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        className="carrusel-btn"
                        onClick={() =>
                          cambiarImagen((indiceImagenActual + 1) % imagenes.length)
                        }
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}

              </div>


            </div>

            {/* CONTENIDO DETALLES + FORMULARIO EN COLUMNAS */}
            <div className="evento-texto-formulario">
              <div className="evento-detalles mb-a">
                <p><strong>Podrás disfrutar de:</strong></p>
                <p className="descripcion-evento">{evento.descripcion || "Descripción no disponible"}</p>

                <div className="info-adicional mt-3">
                  <p><strong>Duración del evento:</strong></p>
                  <p>{formatearFecha(evento.fechaInicio)} - {formatearFecha(evento.fechaFinal)}</p>

                  <p><strong>Lugar:</strong></p>
                  <p>{evento.lugar}</p>
                </div>
              </div>

              {/* FORMULARIO */}
              <form className="formulario" onSubmit={handleSubmit}>
                <h4>Rellene el cuestionario solicitado:</h4>

                {/* Renderizar campos del formulario dinámico */}
                {formularioParseado.map((campo, index) => (
                  <div className="form-group" key={campo.id || index}>
                    <label>{campo.label}{campo.required && <span className="text-danger">*</span>}</label>

                    {campo.type === 'checkbox' ? (
                      <div>
                        {campo.options ? (
                          campo.options.map((opcion, i) => (
                            <div key={i} className="form-check">
                              <input
                                type="checkbox"
                                id={`${campo.id}-${i}`}
                                className="form-check-input"
                                checked={respuestas[campo.id]?.includes(opcion) || false}
                                onChange={(e) => {
                                  const selected = respuestas[campo.id] || [];
                                  let newSelected;
                                  if (e.target.checked) {
                                    newSelected = [...selected, opcion];
                                  } else {
                                    newSelected = selected.filter(item => item !== opcion);
                                  }
                                  handleCampoChange(campo.id, newSelected);
                                }}
                              />
                              <label htmlFor={`${campo.id}-${i}`} className="form-check-label">
                                {opcion}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="form-check">
                            <input
                              type="checkbox"
                              id={campo.id}
                              className="form-check-input"
                              checked={respuestas[campo.id] || false}
                              onChange={(e) => handleCampoChange(campo.id, e.target.checked)}
                            />
                            <label htmlFor={campo.id} className="form-check-label">
                              {campo.label}
                            </label>
                          </div>
                        )}
                      </div>
                    ) : campo.type === 'select' ? (
                      <select
                        className="form-control"
                        value={respuestas[campo.id] || ''}
                        onChange={(e) => handleCampoChange(campo.id, e.target.value)}
                        required={campo.required}
                      >
                        <option value="">Seleccione una opción</option>
                        {campo.options.map((opcion, i) => (
                          <option key={i} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={campo.type === 'number' ? 'number' : 'text'}
                        className="form-control"
                        placeholder={campo.placeholder || ''}
                        value={respuestas[campo.id] || ""}
                        onChange={(e) => handleCampoChange(campo.id, e.target.value)}
                        required={campo.required}
                      />
                    )}
                  </div>
                ))}

                {/* Otros campos */}

                <div className="form-group">
                  <label>Fecha del evento: <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    min={evento.fechaInicio.split('T')[0]}
                    max={evento.fechaFinal.split('T')[0]}
                    value={fechaEvento}
                    onChange={(e) => setFechaEvento(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Número de Boletos a adquirir: <span className="text-danger">*</span></label>
                  <div className="boletos-group d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adultos"
                      min="0"
                      value={numAdultos}
                      onChange={(e) => {
                        const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                        setNumAdultos(soloNumeros);
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Niñ@s"
                      min="0"
                      value={numNinos}
                      onChange={(e) => {
                        const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                        setNumNinos(soloNumeros);
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required
                    />
                  </div>
                </div>

                {errorFormulario && (
                  <div className="alert alert-danger">{errorFormulario}</div>
                )}

                {mensajeExito && (
                  <div className="alert alert-success">{mensajeExito}</div>
                )}

                <button
                  className="boton"
                  type="submit"
                  disabled={enviando}
                >
                  {enviando ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : "Obtener boletos"}
                </button>
              </form>
            </div>
          </div>

          {imagenExpandida && (
            <div className="modal-expandida" onClick={() => setImagenExpandida(false)}>
              <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
                <img
                  src={imagenes[indiceImagenActual].ruta_imagen}
                  alt={`Imagen ampliada ${indiceImagenActual + 1}`}
                  className="imagen-ampliada"
                />
              </div>
            </div>
          )}

          {mostrarQR && (
            <div className="modal-backdrop-custom">
              <div className="modal-qr-content">
                <h4 className="text-center mb-3">¡Reserva Generada!</h4>
                <p className="text-center">
                  <strong>Boletos:</strong><br />
                  Adultos: {numAdultos} <br />
                  Niños: {numNinos}
                </p>

                <div className="qr-container">
                  <QRCodeCanvas
                    value={`ReservaID:${qrValue}`}  // usa qrValue que viene del backend
                    size={220}
                  />
                </div>

                <p className="text-center mt-3">
                  Lleva este código el día del evento
                </p>

                <div className="text-center mt-4">
                  <button
                    className="btn btn-success"
                    onClick={() => setMostrarQR(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
      <Comp_Pie_pagina />
    </div>
  );
};

export default EventosDescripcion;