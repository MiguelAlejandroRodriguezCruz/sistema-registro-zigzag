import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";

const RegistroForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    edad: "",
    contrasena: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:3001/visitantes-eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
      navigate("/login");
    } catch (err) {
      console.error('Error al registrar:', err);
      setError(err.message || 'Ocurrió un error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolver = () => navigate(-1);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado />
      <div className='login-header'/>
      <div className="login-box bg-white">
        <h1 className="login-title card-title text-center mb-4">Crear cuenta</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="login-label">Nombre completo</label>
            <input 
              type="text" 
              className="uniforme" 
              placeholder="Juan Pérez" 
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="login-label">Correo</label>
            <input 
              type="email" 
              className="uniforme" 
              placeholder="correo@ejemplo.com" 
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="login-label">Edad</label>
            <input 
              type="number" 
              className="uniforme" 
              placeholder="25" 
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="mb-4">
            <label className="login-label">Contraseña</label>
            <input 
              type="password" 
              className="uniforme" 
              placeholder="********" 
              name="contrasena"
              value={formData.contrasena}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="login-button btn-success" 
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </button>
            <button 
              type="button" 
              className="login-button-gray btn-secondary" 
              onClick={handleVolver}
            >
              Volver
            </button>
          </div> 
        </form>
      </div>

      <Comp_Pie_pagina />
    </div>
  );
};

export default RegistroForm;