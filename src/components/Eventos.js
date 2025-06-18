import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CrearEvento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    lugar: "",
    descripcion: "",
    formulario: "form temporal",
    baner: "banner temporal"
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos del evento si estamos editando
  useEffect(() => {
  if (id) {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`http://localhost:3001/eventos/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener el evento');
        }
        const data = await response.json();
        
        // Formatear fechas para el input
        const formattedData = {
          ...data,
          fechaInicio: data.fechaInicio ? data.fechaInicio.split('T')[0] : "",
          fechaFinal: data.fechaFinal ? data.fechaFinal.split('T')[0] : ""
        };
        
        setFormData(formattedData);
        setIsEditing(true);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    };
    fetchEvento();
  }
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validar fechas
      if (new Date(formData.fechaInicio) > new Date(formData.fechaFinal)) {
        throw new Error('La fecha de inicio no puede ser mayor a la fecha final');
      }

      let response;
      if (isEditing) {
        // Actualizar evento existente
        response = await fetch(`http://localhost:3001/eventos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      } else {
        // Crear nuevo evento
        response = await fetch('http://localhost:3001/eventos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      }

      if (!response.ok) {
        throw new Error(isEditing ? 'Error al actualizar el evento' : 'Error al crear el evento');
      }

      const data = await response.json();
      console.log(isEditing ? 'Evento actualizado:' : 'Evento creado con ID:', data.idInsertado || id);
      
      // Redirigir con estado para mostrar notificación
      navigate("/lista-eventos", { 
        state: { 
          [isEditing ? 'eventoActualizado' : 'eventoCreado']: true 
        } 
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || `Ocurrió un error al ${isEditing ? 'actualizar' : 'crear'} el evento`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Regresar a la página anterior
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      {/* Encabezado */}
      <div style={{ backgroundColor: "#22a31f", color: "#fff", padding: "10px" }}>
        <img src="ruta-del-logo.png" alt="Logo ZigZag" style={{ height: "60px" }} />
        <h2 style={{ margin: 0, backgroundColor: "#22a31f" }}>Eventos</h2>
        <a href="#" onClick={handleCancel} style={{ color: "#fff", textDecoration: "underline", fontSize: "14px", cursor: "pointer" }}>← Regresar</a>
      </div>

      {/* Texto de instrucciones */}
      <p style={{ marginTop: "20px", fontSize: "22px" }}>
        <strong>NOTA: {isEditing ? 'Edición' : 'Creación'} de un evento, favor de llenar todos los campos disponibles y revisar correctamente el contenido de los mismos.</strong>
      </p>

      {error && (
        <div className="alert alert-danger" style={{ marginTop: "20px" }}>
          {error}
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Columna izquierda */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div className="mb-3">
              <label>Nombre del evento:</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Escriba un nombre" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Fecha del evento:</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="date" 
                  className="form-control" 
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="date" 
                  className="form-control" 
                  name="fechaFinal"
                  value={formData.fechaFinal}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Lugar del evento:</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ingrese una dirección" 
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Descripción del evento:</label>
              <textarea 
                className="form-control" 
                rows="5" 
                placeholder="Escriba aquí" 
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div className="mb-3">
              <label>Banner (opcional):</label>
              <button 
                type="button" 
                className="btn btn-secondary w-100 mb-2"
                onClick={() => alert("Funcionalidad de banner pendiente")}
              >
                + Agregar Banner
              </button>
              <div className="image-placeholder mb-3" style={placeholderStyle}>
                {formData.baner}
              </div>
            </div>

            <div className="mb-3">
              <label>Formulario:</label>
              <button 
                type="button" 
                className="btn btn-warning w-100 mb-2"
                onClick={() => alert("Funcionalidad de formulario pendiente")}
              >
                Crear formulario de evento
              </button>
              <div className="image-placeholder mb-3" style={placeholderStyle}>
                {formData.formulario}
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-4" style={{ display: "flex", gap: "10px" }}>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Evento' : 'Guardar Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Estilo para los cuadros de imagen
const placeholderStyle = {
  width: "100%",
  height: "100px",
  backgroundColor: "#e6e6e6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "10px",
  textAlign: "center",
  color: "#666",
};