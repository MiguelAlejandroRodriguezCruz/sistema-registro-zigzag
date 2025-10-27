import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Comp_encabezado } from "../Comp/Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp/Comp_Pie_pagina"
import { API_BASE_URL } from "../../config/api";

export default function CrearEvento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    lugar: "",
    descripcion: "",
    formulario: [],
    baner: "",
    maxPersonas: 0
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Archivos de imágenes adicionales
  const [imagePreviews, setImagePreviews] = useState([]); // Previews de imágenes
  const [eventImages, setEventImages] = useState([]); // Imágenes ya guardadas
  const [excelAvailable, setExcelAvailable] = useState(false);

  // Cargar datos del evento si estamos editando
  useEffect(() => {
    if (id) {
      const fetchEvento = async () => {
        try {
          const token = localStorage.getItem("tokenAdmin");
          const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
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

      // Cargar imágenes existentes
      const fetchEventImages = async () => {
        try {
          const token = localStorage.getItem("tokenAdmin");
          const response = await fetch(`${API_BASE_URL}/eventos/${id}/imagenes`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Error al obtener imágenes');
          const data = await response.json();
          setEventImages(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchEventImages();

      // Comprobar si existe Excel disponible para este evento
      const checkExcel = async () => {
        try {
          const token = localStorage.getItem('tokenAdmin');
          const resp = await fetch(`${API_BASE_URL}/formulario/exists/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!resp.ok) {
            setExcelAvailable(false);
            return;
          }
          const json = await resp.json();
          setExcelAvailable(!!json.exists);
        } catch (err) {
          console.error('Error comprobando existencia de Excel:', err);
          setExcelAvailable(false);
        }
      };
      checkExcel();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de imágenes adicionales
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validar que sean imágenes y no excedan el tamaño
    const validFiles = files.filter(file =>
      file.type.match('image.*') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setError('Algunos archivos no son imágenes o son demasiado grandes (máx. 5MB)');
    }

    // Crear previsualizaciones
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImageFiles(prev => [...prev, ...validFiles]);
  };

  // Eliminar preview de imagen
  const removeImagePreview = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Eliminar imagen ya guardada
  const removeEventImage = async (imageId) => {
    try {
      const token = localStorage.getItem("tokenAdmin");
      const response = await fetch(`${API_BASE_URL}/eventos/imagenes/${imageId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al eliminar imagen');
      setEventImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      setError(err.message);
    }
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
      formDataToSend.append('maxPersonas', formData.maxPersonas);

      // Agregar archivo si existe
      if (bannerFile) {
        formDataToSend.append('baner', bannerFile);
      }

      let response;
      let eventoId;
      let createdEventData;

      if (isEditing) {
        // Actualizar evento existente
        const token = localStorage.getItem("tokenAdmin");
        response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el evento');
        }

        eventoId = id;
      } else {
        // Crear nuevo evento
        const token = localStorage.getItem("tokenAdmin");
        response = await fetch(`${API_BASE_URL}/eventos`, {
          method: 'POST',
          body: formDataToSend,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al crear el evento');
        }

        createdEventData = await response.json();
        eventoId = createdEventData.idInsertado;
      }

      // Subir imágenes adicionales si hay
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach(file => {
          formDataImages.append('imagenes', file);
        });
        const token = localStorage.getItem("tokenAdmin");
        const uploadResponse = await fetch(`${API_BASE_URL}/eventos/${eventoId}/imagenes`, {
          method: 'POST',
          body: formDataImages,
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!uploadResponse.ok) {
          throw new Error('Error al subir imágenes adicionales');
        }
      }

      if (!response.ok) {
        throw new Error(isEditing ? 'Error al actualizar el evento' : 'Error al crear el evento');
      }

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

  // Nueva función para manejar la eliminación
  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este evento? Esta acción es irreversible.')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("tokenAdmin");
      const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }

      navigate("/lista-eventos", {
        state: { eventoEliminado: true }
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ocurrió un error al eliminar el evento');
    } finally {
      setIsLoading(false);
    }
  };

const handleDownloadExcel = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem("tokenAdmin");
    const response = await fetch(`${API_BASE_URL}/formulario/excel/${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Error al descargar el archivo Excel");
    }

    // 📥 Convertir la respuesta en un blob (archivo binario)
    const blob = await response.blob();

    // 🧩 Crear un enlace temporal de descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formulario_evento_${id}.xlsx`; // nombre del archivo
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Liberar memoria
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Error:", err);
    setError(err.message || "Ocurrió un error al descargar el archivo");
  } finally {
    setIsLoading(false);
  }
};


  // Funciones para el formulario dinámico
  const addFormField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: "",
      required: false,
      options: type === 'select' ? [""] : null,
      ...(type === 'file' && {
        acceptedTypes: "*"
      })
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
        const currentOptions = Array.isArray(field.options) ? field.options : [];
        const newOptions = [...currentOptions];
        newOptions[optionIndex] = value;
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const addOption = (fieldId) => {
    setFormFields(formFields.map(field =>
      field.id === fieldId
        ? { ...field, options: Array.isArray(field.options) ? [...field.options, ""] : [""] }
        : field
    ));
  };

  const removeOption = (fieldId, optionIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        const currentOptions = Array.isArray(field.options) ? field.options : [];
        const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
        return { ...field, options: newOptions };
      }
      return field;
    }));
  };

  const updateFileConfig = (fieldId, configKey, value) => {
    setFormFields(formFields.map(field =>
      field.id === fieldId ? { ...field, [configKey]: value } : field
    ));
  };

  return (
    <div>
      {/* Encabezado */}
      <Comp_encabezado />
      <div style={{ backgroundColor: "#22a31f", color: "#fff", padding: "10px" }}>
        <h2 style={{ margin: 0, backgroundColor: "#22a31f" }}>Eventos</h2>
        <a href="#" onClick={handleCancel} style={{ color: "#fff", textDecoration: "underline", fontSize: "14px", cursor: "pointer" }}>← Regresar</a>
      </div>
      <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>



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

              <div className="mb-3">
                <label>Numero maximo de personas que pueden asistir:</label>
                <input
                  type="integer"
                  className="form-control"
                  placeholder="0"
                  name="maxPersonas"
                  value={formData.maxPersonas}
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
                {/* Sección para imágenes adicionales */}
                <div className="mb-3">
                  <label>Imágenes adicionales del evento:</label>
                  <div className="mb-2">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="image-upload"
                      className="btn btn-secondary w-100"
                      style={{ cursor: 'pointer' }}
                    >
                      Seleccionar Imágenes
                    </label>
                  </div>

                  {/* Previsualización de imágenes nuevas */}
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="img-thumbnail"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => removeImagePreview(index)}
                          style={{ padding: '2px 5px' }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Imágenes ya guardadas (solo en edición) */}
                  {isEditing && eventImages.length > 0 && (
                    <div>
                      <h6>Imágenes del evento:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {eventImages.map(img => (
                          <div key={img.id} className="position-relative" style={{ width: '100px', height: '100px' }}>
                            <img
                              src={img.ruta_imagen}
                              alt={`Evento ${img.id}`}
                              className="img-thumbnail"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => removeEventImage(img.id)}
                              style={{ padding: '2px 5px' }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
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
                      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => addFormField('checkbox')}>
                        + Checkbox
                      </button>
                      {/* 🔹 BOTÓN PARA ARCHIVOS - SIEMPRE UN SOLO ARCHIVO */}
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addFormField('file')}>
                        + Archivo
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

                          {field.type === 'file' && (
                            <div>
                              <div className="mb-2">
                                <label className="form-label">Tipos de archivo aceptados:</label>
                                <select
                                  className="form-select"
                                  value={field.acceptedTypes || "*"}
                                  onChange={(e) => updateFileConfig(field.id, 'acceptedTypes', e.target.value)}
                                >
                                  <option value="*">Todos los archivos</option>
                                  <option value=".pdf,.doc,.docx">Documentos (PDF, Word)</option>
                                  <option value=".jpg,.jpeg,.png,.gif">Imágenes</option>
                                  <option value=".pdf">Solo PDF</option>
                                  <option value=".jpg,.jpeg,.png">Solo imágenes</option>
                                </select>
                              </div>
                              {/* 🔹 MENSAJE INFORMATIVO */}
                              <div className="text-info small">
                                ⓘ Este campo permitirá subir solo un archivo
                              </div>
                            </div>
                          )}

                          {field.type === 'select' && (
                            <div>
                              <label className="form-label">Opciones:</label>
                              {Array.isArray(field.options) && field.options.map((opt, idx) => (
                                <div key={idx} className="input-group mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={opt}
                                    onChange={(e) => updateOption(field.id, idx, e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeOption(field.id, idx)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              ))}
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => addOption(field.id)}>
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
            {isEditing && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar Evento'}
              </button>
            )}

            {isEditing && excelAvailable && (
              <button
                type="button"
                className="btn btn-success"
                onClick={handleDownloadExcel}
                disabled={isLoading}
              >
                {isLoading ? 'Descargando...' : 'Descargar Excel'}
              </button>
            )}


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
      <Comp_Pie_pagina />
    </div>

  );
}

// Funciones de utilidad
const getFieldTypeName = (type) => {
  const names = {
    text: 'Texto',
    number: 'Número',
    select: 'Selección',
    checkbox: 'Checkbox',
    file: 'Archivo'
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
          {(Array.isArray(field.options) && field.options.length > 0 ? field.options : ["(Sin opciones)"]).map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      );
    case 'checkbox':
      return <input type="checkbox" disabled />;
    case 'file':
      return (
        <input
          type="file"
          className="form-control"
          disabled
          accept={field.acceptedTypes || "*"}
          // 🔹 multiple={false} es el valor por defecto, pero lo dejamos explícito
          multiple={false}
        />
      );
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