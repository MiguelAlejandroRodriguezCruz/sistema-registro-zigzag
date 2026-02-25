import React, { useState, useEffect, useRef } from "react"; // Agrega useRef
import { useParams } from "react-router-dom";
import { Comp_encabezado } from "../Comp/Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp/Comp_Pie_pagina";
import { QRCodeCanvas } from 'qrcode.react';
import "../../style/EventosDescripcion.css"
import { API_BASE_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";

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

const EventosDescripcion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [estaRegistrado, setEstaRegistrado] = useState(false);

  // Estados para el formulario
  const [fechaEvento, setFechaEvento] = useState("");
  const [numAdultos, setNumAdultos] = useState("");
  const [numNinos, setNumNinos] = useState("");
  const [respuestas, setRespuestas] = useState({});
  const [archivos, setArchivos] = useState({});
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
        const token = localStorage.getItem("tokenUsuario");
        const respuesta = await fetch(`${API_BASE_URL}/eventos/${id}`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        });
        if (!respuesta.ok) {
          throw new Error('Error al cargar el evento');
        }
        const datos = await respuesta.json();
        setEvento(datos);

        // Si hay usuario, verificar si ya está registrado a este evento
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const registrosResp = await fetch(`${API_BASE_URL}/eventos/registrados/${parsedUser.id}`,{
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("tokenUsuario")}`
              }
            });
            if (registrosResp.ok) {
              const registros = await registrosResp.json();
              const ya = registros.some(r => String(r.id) === String(datos.id) || String(r.id_evento) === String(datos.id));
              setEstaRegistrado(ya);
            }
          }
        } catch (e) {
          console.warn('No se pudo comprobar registro previo:', e);
        }

        // Cargar imágenes adicionales del evento
        const imagenesResponse = await fetch(`${API_BASE_URL}/eventos/${id}/imagenes`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
        });
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

      // Crear FormData para enviar archivos
      const formData = new FormData();
      formData.append('id_visitante', user.id);
      formData.append('id_evento', evento.id);
      formData.append('formulario', JSON.stringify(respuestas));
      formData.append('fecha_evento', fechaEvento);
      formData.append('num_adultos', parseInt(numAdultos) || 0);
      formData.append('num_ninos', parseInt(numNinos) || 0);

      // Agregar archivos al FormData
      Object.keys(archivos).forEach(campoId => {
        if (archivos[campoId]) {
          formData.append(`archivos_${campoId}`, archivos[campoId]);
        }
      });

      const token = localStorage.getItem("tokenUsuario");
      const respuesta = await fetch(`${API_BASE_URL}/formulario/guardar`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || 'Error al guardar formulario');

      setMensajeExito('¡Formulario guardado exitosamente!');
      setQrValue(resultado.codigo_qr);
      setMostrarQR(true);

    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setEnviando(false);
    }
  };

  // Manejar cambio de archivos
  const handleArchivoChange = (campoId, archivosSeleccionados) => {
    setArchivos(prev => ({
      ...prev,
      [campoId]: archivosSeleccionados[0] // Solo tomar el primer archivo
    }));
    
    // También guardar el nombre del archivo en las respuestas
    setRespuestas(prev => ({
      ...prev,
      [campoId]: archivosSeleccionados[0] ? archivosSeleccionados[0].name : ''
    }));
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
      <div className="mt-4">
        <Comp_encabezado />
        <header className="eventos-header azul">
          <h1 className="text-white m-0">Evento</h1>
        </header>

        <div className="eventos-container">
          <div className="sin-eventos-card">
            <div className="sin-eventos-content">
              <div className="sin-eventos-icon">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <h2 className="sin-eventos-title">No se pudo cargar el evento</h2>
              <p className="sin-eventos-description">Ocurrió un problema al intentar cargar la información del evento.</p>
              <p className="sin-eventos-subtitle">Es posible que la URL sea incorrecta o que el evento ya no exista.</p>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary me-2" onClick={() => window.location.reload()}>Reintentar</button>
                <button className="btn btn-secondary" onClick={() => navigate('/eventos-visitantes')}>Ir a Eventos</button>
              </div>
            </div>
          </div>
        </div>

        <Comp_Pie_pagina />
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="mt-4">
        <Comp_encabezado />
        <header className="eventos-header azul">
          <h1 className="text-white m-0">Evento no encontrado</h1>
        </header>

        <div className="eventos-container">
          <div className="sin-eventos-card">
            <div className="sin-eventos-content">
              <div className="sin-eventos-icon">
                <i className="bi bi-calendar-x"></i>
              </div>
              <h2 className="sin-eventos-title">Evento no encontrado</h2>
              <p className="sin-eventos-description">El evento que buscas no existe o fue eliminado.</p>
              <p className="sin-eventos-subtitle">Verifica la dirección o regresa a la lista de eventos para explorar otros.</p>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary me-2" onClick={() => navigate('/eventos-visitantes')}>Ver eventos</button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Ir al inicio</button>
              </div>
            </div>
          </div>
        </div>

        <Comp_Pie_pagina />
      </div>
    );
  }

  if (estaRegistrado) {
    return (
      <div className="mt-4">
        <Comp_encabezado />
        <header className="eventos-header azul">
          <h1 className="text-white m-0">Acceso restringido</h1>
        </header>

        <div className="eventos-container">
          <div className="sin-eventos-card">
            <div className="sin-eventos-content">
              <div className="sin-eventos-icon">
                <i className="bi bi-lock-fill"></i>
              </div>
              <h2 className="sin-eventos-title">Ya estás registrado</h2>
              <p className="sin-eventos-description">No puedes volver a registrarte en este evento desde esta página.</p>
              <p className="sin-eventos-subtitle">Si necesitas modificar tu registro, ve a tus eventos registrados.</p>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary me-2" onClick={() => navigate('/eventos-registrados')}>Ver mis registros</button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/eventos-visitantes')}>Explorar otros eventos</button>
              </div>
            </div>
          </div>
        </div>

        <Comp_Pie_pagina />
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
                  src={resolveImageUrl(evento.baner) || "/placeholder.png"}
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
                        src={resolveImageUrl(imagenes[indiceImagenActual].ruta_imagen)}
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
                    <label>
                      {campo.label}
                      {campo.required && <span className="text-danger">*</span>}
                    </label>

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
                    ) : campo.type === 'file' ? (
                      // 🔹 NUEVO: Campo para archivos
                      <div>
                        <input
                          type="file"
                          className="form-control"
                          accept={campo.acceptedTypes || "*"}
                          onChange={(e) => handleArchivoChange(campo.id, e.target.files)}
                          required={campo.required}
                        />
                        {archivos[campo.id] && (
                          <div className="mt-2">
                            <small className="text-success">
                              ✅ Archivo seleccionado: {archivos[campo.id].name}
                            </small>
                            <br />
                            <small className="text-muted">
                              Tamaño: {(archivos[campo.id].size / 1024 / 1024).toFixed(2)} MB
                            </small>
                          </div>
                        )}
                        {campo.acceptedTypes && campo.acceptedTypes !== "*" && (
                          <small className="text-muted">
                            Tipos permitidos: {campo.acceptedTypes}
                          </small>
                        )}
                      </div>
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
                  src={resolveImageUrl(imagenes[indiceImagenActual].ruta_imagen)}
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
                    onClick={() => {
                      setMostrarQR(false);   // cerrar modal
                      navigate("/eventos-visitantes"); // redirigir
                    }}
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