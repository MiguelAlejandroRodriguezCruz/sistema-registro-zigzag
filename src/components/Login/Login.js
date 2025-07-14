import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Comp_encabezado } from "../Comp_encabezado";
import { Comp_Pie_pagina } from "../Comp_Pie_pagina";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: "",
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/visitantes-eventos/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error en el login');
      }

      // Guardar información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.visitante));
      
      // Redirigir a la página de eventos
      navigate("/eventos-visitantes");
      
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Ocurrió un error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    navigate("/registro");
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Comp_encabezado/>  
      <div className='login-header'/>
      
      <form onSubmit={handleLogin} className="login-box bg-white">
        <h1 className="login-title text-center mb-4">Iniciar sesión</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="login-label">Correo</label>
          <input 
            type="email" 
            name="correo"
            placeholder="correo@ejemplo.com" 
            className="uniforme" 
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="login-label">Contraseña</label>
          <input 
            type="password" 
            name="contrasena"
            placeholder="*******" 
            className="uniforme" 
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="login-links mb-3">
          <a href="" onClick={(e) => {
            e.preventDefault();
            navigate("/solicitar-codigo");
          }} style={{ cursor: "pointer" }}>
            ¿Olvidaste tu contraseña?
          </a>
          <a href="" onClick={handleCreateAccount} style={{ cursor: "pointer" }}>Crear una cuenta</a>
        </div>

        <button 
          type="submit" 
          className="login-button btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <Comp_Pie_pagina/>
    </div>
  );
};

export default LoginForm;