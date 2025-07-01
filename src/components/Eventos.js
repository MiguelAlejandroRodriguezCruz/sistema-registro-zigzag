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
    formulario: [], // Ahora será un array de objetos
    baner: "banner temporal"
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

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
            fechaFinal: data.fechaFinal ? data.fechaFinal.split('T')[0] : "",
            formulario: data.formulario ? JSON.parse(data.formulario) : []
          };
          
          setFormData(formattedData);
          setFormFields(formattedData.formulario);

          // Cargar preview del banner si existe
          if (formattedData.baner && formattedData.baner !== "banner temporal") {
            setBannerPreview(formattedData.baner);
          }

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

  // Manejar cambio de archivo de banner
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match('image.*')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }
      
      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande (máximo 5MB)');
        return;
      }
      
      setBannerFile(file);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

      // Validar que se haya subido un banner al crear
      if (!isEditing && !bannerFile) {
        throw new Error('Debe subir un banner para el evento');
      }

      // Crear FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('fechaInicio', formData.fechaInicio);
      formDataToSend.append('fechaFinal', formData.fechaFinal);
      formDataToSend.append('lugar', formData.lugar);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('formulario', JSON.stringify(formFields));

      // Agregar archivo si existe
      if (bannerFile) {
        formDataToSend.append('baner', bannerFile);
      }

      let response;
      if (isEditing) {
        // Actualizar evento existente
        response = await fetch(`http://localhost:3001/eventos/${id}`, {
          method: 'PUT',
          body: formDataToSend
        });
      } else {
        // Crear nuevo evento
        response = await fetch('http://localhost:3001/eventos', {
          method: 'POST',
          body: formDataToSend
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
    navigate(-1);
  };

  // Funciones para el formulario dinámico
  const addFormField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: "",
      required: false,
      options: type === 'select' ? [""] : null
    };
    setFormFields([...formFields, newField]);
  };

  const removeFormField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const updateFieldLabel = (id, value) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, label: value } : field
    ));
  };

  const toggleFieldRequired = (id) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, required: !field.required } : field
    ));
  };

  const updateOption = (fieldId, optionIndex, value) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        const newOptions = [...field.options];
        newOptions[optionIndex] = value;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const addOption = (fieldId) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId 
        ? { ...field, options: [...field.options, ""] } 
        : field
    ));
  };

  const removeOption = (fieldId, optionIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        const newOptions = field.options.filter((_, idx) => idx !== optionIndex);
        return { ...field, options: newOptions };
      }
      return field;
    }));
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
              <label>Banner:</label>
              <div className="mb-2">
                <input 
                  type="file" 
                  id="banner-upload"
                  accept="image/*"
                  onChange={handleBannerChange}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="banner-upload" 
                  className="btn btn-secondary w-100"
                  style={{ cursor: 'pointer' }}
                >
                  {bannerFile || bannerPreview ? 'Cambiar Banner' : 'Seleccionar Banner'}
                </label>
              </div>
              <div className="image-placeholder mb-3" style={placeholderStyle}>
                {/* Vista previa del banner */}
                {bannerPreview ? (
                  <div className="mb-3" style={{ textAlign: 'center' }}>
                    <img 
                      src={bannerPreview} 
                      alt="Vista previa del banner" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '5px'
                      }} 
                    />
                    <p className="mt-2 small text-muted">
                      Vista previa del banner
                    </p>
                  </div>
                ) : (
                  <div className="image-placeholder mb-3" style={placeholderStyle}>
                    {isEditing && formData.baner !== "banner temporal" 
                      ? "Banner existente (no cambiará a menos que suba uno nuevo)" 
                      : "Sin banner seleccionado"}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label>Formulario:</label>
              <button 
                type="button" 
                className="btn btn-warning w-100 mb-2"
                onClick={() => setShowFormBuilder(!showFormBuilder)}
              >
                {showFormBuilder ? 'Ocultar Constructor' : 'Crear formulario de evento'}
              </button>
              
              {showFormBuilder && (
                <div className="form-builder" style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
                  <div className="mb-3">
                    <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => addFormField('text')}>
                      + Texto
                    </button>
                    <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => addFormField('number')}>
                      + Número
                    </button>
                    <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => addFormField('select')}>
                      + Selección
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addFormField('checkbox')}>
                      + Checkbox
                    </button>
                  </div>

                  {formFields.map((field) => (
                    <div key={field.id} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <div>
                            <strong>{getFieldTypeName(field.type)}</strong>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFormField(field.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                        
                        <div className="mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Etiqueta del campo"
                            value={field.label}
                            onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                          />
                        </div>
                        
                        <div className="form-check mb-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={field.required}
                            onChange={() => toggleFieldRequired(field.id)}
                          />
                          <label className="form-check-label">Requerido</label>
                        </div>
                        
                        {field.type === 'select' && (
                          <div>
                            <label>Opciones:</label>
                            {field.options.map((option, idx) => (
                              <div key={idx} className="d-flex mb-2">
                                <input
                                  type="text"
                                  className="form-control"
                                  value={option}
                                  onChange={(e) => updateOption(field.id, idx, e.target.value)}
                                />
                                <button 
                                  type="button" 
                                  className="btn btn-sm btn-danger ms-2"
                                  onClick={() => removeOption(field.id, idx)}
                                >
                                  -
                                </button>
                              </div>
                            ))}
                            <button 
                              type="button" 
                              className="btn btn-sm btn-secondary"
                              onClick={() => addOption(field.id)}
                            >
                              + Agregar opción
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="preview mb-3" style={placeholderStyle}>
                <h5>Vista previa del formulario:</h5>
                {formFields.length === 0 ? (
                  <p>No hay campos definidos</p>
                ) : (
                  <div>
                    {formFields.map((field) => (
                      <div key={field.id} className="mb-2">
                        <label>
                          {field.label || "(Sin etiqueta)"} 
                          {field.required && <span className="text-danger">*</span>}
                        </label>
                        {renderPreviewField(field)}
                      </div>
                    ))}
                  </div>
                )}
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

// Funciones de utilidad
const getFieldTypeName = (type) => {
  const names = {
    text: 'Texto',
    number: 'Número',
    select: 'Selección',
    checkbox: 'Checkbox'
  };
  return names[type] || type;
};

const renderPreviewField = (field) => {
  switch (field.type) {
    case 'text':
      return <input type="text" className="form-control" disabled />;
    case 'number':
      return <input type="number" className="form-control" disabled />;
    case 'select':
      return (
        <select className="form-control" disabled>
          {field.options.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      );
    case 'checkbox':
      return <input type="checkbox" disabled />;
    default:
      return <input type="text" className="form-control" disabled />;
  }
};

// Estilo para los cuadros de imagen
const placeholderStyle = {
  width: "100%",
  minHeight: "100px",
  backgroundColor: "#f8f9fa",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #ccc",
  borderRadius: "4px",
  padding: "10px",
  textAlign: "center",
  color: "#666",
};